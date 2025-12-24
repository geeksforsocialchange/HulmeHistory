// Map manager - handles map initialization, layers, and slider

import maplibregl from 'maplibre-gl';
import { HULME_CENTER, DEFAULT_ZOOM, ERA_CONFIG, TILE_SOURCES, BASE_LAYERS, type EraKey } from './map-config';

export class MapManager {
  map: maplibregl.Map;
  marker: maplibregl.Marker | null = null;
  activeTraced: Set<string> = new Set();

  constructor(container: string) {
    this.map = new maplibregl.Map({
      container,
      style: {
        version: 8,
        sources: TILE_SOURCES as any,
        layers: BASE_LAYERS as any,
      },
      center: HULME_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    // Add controls temporarily, then move into grid
    this.map.addControl(new maplibregl.AttributionControl({ compact: false }), 'bottom-left');
    this.map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-left');

    // Move controls into grid slots after render
    setTimeout(() => {
      const zoomSlot = document.getElementById('zoom-slot');
      const creditSlot = document.getElementById('credit-slot');
      const navCtrl = document.querySelector('.maplibregl-ctrl-group');
      const attrCtrl = document.querySelector('.maplibregl-ctrl-attrib');

      if (zoomSlot && navCtrl) {
        zoomSlot.appendChild(navCtrl);
      }
      if (creditSlot && attrCtrl) {
        // Move just the inner content, not the wrapper
        creditSlot.innerHTML = attrCtrl.innerHTML;
        attrCtrl.remove();
      }
    }, 100);
  }

  async loadTracedLayers(): Promise<void> {
    for (const [year, config] of Object.entries(ERA_CONFIG)) {
      await this.loadEraLayers(year, config);
    }
  }

  private async loadEraLayers(year: string, config: typeof ERA_CONFIG[EraKey]): Promise<void> {
    // Load blocks
    try {
      const blocksRes = await fetch(`/gis/${year}_blocks.geojson`);
      if (blocksRes.ok) {
        const blocksData = await blocksRes.json();
        this.map.addSource(`${year}-blocks`, { type: 'geojson', data: blocksData });
        this.map.addLayer({
          id: `${year}-blocks-fill`,
          type: 'fill',
          source: `${year}-blocks`,
          paint: { 'fill-color': config.blocks.fill, 'fill-opacity': 0 },
        });
        this.map.addLayer({
          id: `${year}-blocks-line`,
          type: 'line',
          source: `${year}-blocks`,
          paint: { 'line-color': config.blocks.stroke, 'line-width': 1, 'line-opacity': 0 },
        });
      }
    } catch (e) {
      console.warn(`Failed to load ${year} blocks`);
    }

    // Load buildings
    try {
      const buildingsRes = await fetch(`/gis/${year}_figure_ground.geojson`);
      if (buildingsRes.ok) {
        const buildingsData = await buildingsRes.json();
        this.map.addSource(`${year}-buildings`, { type: 'geojson', data: buildingsData });
        this.map.addLayer({
          id: `${year}-buildings-fill`,
          type: 'fill',
          source: `${year}-buildings`,
          paint: { 'fill-color': config.buildings.fill, 'fill-opacity': 0 },
        });
        this.map.addLayer({
          id: `${year}-buildings-line`,
          type: 'line',
          source: `${year}-buildings`,
          paint: { 'line-color': config.buildings.stroke, 'line-width': 1, 'line-opacity': 0 },
        });
      }
    } catch (e) {
      console.warn(`Failed to load ${year} buildings`);
    }
  }

  toggleTracedLayer(era: string): void {
    if (this.activeTraced.has(era)) {
      this.activeTraced.delete(era);
    } else {
      this.activeTraced.add(era);
    }
    this.updateTracedLayers();
  }

  addTracedLayer(era: string): void {
    if (!this.activeTraced.has(era)) {
      this.activeTraced.add(era);
      this.updateTracedLayers();
    }
  }

  updateTracedLayers(): void {
    for (const year of Object.keys(ERA_CONFIG)) {
      const show = this.activeTraced.has(year);
      const layers = [
        `${year}-blocks-fill`,
        `${year}-blocks-line`,
        `${year}-buildings-fill`,
        `${year}-buildings-line`,
      ];

      layers.forEach((id) => {
        if (this.map.getLayer(id)) {
          const prop = id.includes('line') ? 'line-opacity' : 'fill-opacity';
          let val = 0;
          if (show) {
            if (id.includes('buildings')) {
              val = id.includes('line') ? 1 : 0.8;
            } else {
              val = id.includes('line') ? 0.6 : 0.5;
            }
          }
          this.map.setPaintProperty(id, prop, val);
        }
      });
    }
  }

  updateSlider(value: number): void {
    // Keep event polygon visible across era changes - don't clear it here

    // 0 = 1890s Victorian, 33 = 1940s, 66 = 2014, 100 = Modern
    let victorianOpacity = 0;
    let os1940sOpacity = 0;
    let esri2014Opacity = 0;
    let cartoOpacity = 0.1;

    if (value <= 33) {
      const t = value / 33;
      victorianOpacity = (1 - t) * 0.9;
      os1940sOpacity = t * 0.85;
    } else if (value <= 66) {
      const t = (value - 33) / 33;
      os1940sOpacity = (1 - t) * 0.85;
      esri2014Opacity = t * 0.95;
    } else {
      const t = (value - 66) / 34;
      esri2014Opacity = (1 - t) * 0.95;
      cartoOpacity = 0.1 + t * 0.9;
    }

    this.map.setPaintProperty('os-victorian', 'raster-opacity', victorianOpacity);
    this.map.setPaintProperty('os-1940s', 'raster-opacity', os1940sOpacity);
    this.map.setPaintProperty('esri-2014', 'raster-opacity', esri2014Opacity);
    this.map.setPaintProperty('carto', 'raster-opacity', cartoOpacity);
  }

  clearEventPolygon(): void {
    if (this.map.getLayer('event-polygon-fill')) {
      this.map.removeLayer('event-polygon-fill');
    }
    if (this.map.getLayer('event-polygon-line')) {
      this.map.removeLayer('event-polygon-line');
    }
    if (this.map.getSource('event-polygon')) {
      this.map.removeSource('event-polygon');
    }
  }

  async setMarker(eventId: string): Promise<void> {
    this.marker?.remove();
    this.marker = null;
    this.clearEventPolygon();

    try {
      const res = await fetch(`/events/${eventId}/file.geojson`);
      if (res.ok) {
        const data = await res.json();
        const features = data.features || [];
        if (features.length === 0) return;

        // Check what geometry types are present
        const geomTypes = new Set(features.map((f: any) => f.geometry?.type));
        const hasPoint = geomTypes.has('Point');
        const hasPolygon = geomTypes.has('Polygon') || geomTypes.has('MultiPolygon');
        const hasLine = geomTypes.has('LineString') || geomTypes.has('MultiLineString');

        if (hasPoint && !hasPolygon && !hasLine) {
          // Point-only: use marker
          const coords = features[0].geometry.coordinates;
          this.marker = new maplibregl.Marker({ color: '#8b4513' })
            .setLngLat(coords)
            .addTo(this.map);
          this.map.flyTo({ center: coords, zoom: 15.5 });
        } else {
          // Mixed or polygon/line: use layers
          this.map.addSource('event-polygon', { type: 'geojson', data });

          if (hasPolygon) {
            this.map.addLayer({
              id: 'event-polygon-fill',
              type: 'fill',
              source: 'event-polygon',
              filter: ['in', ['geometry-type'], ['literal', ['Polygon', 'MultiPolygon']]],
              paint: {
                'fill-color': '#ff00ff',
                'fill-opacity': 0.15,
              },
            });
          }

          if (hasPolygon || hasLine) {
            this.map.addLayer({
              id: 'event-polygon-line',
              type: 'line',
              source: 'event-polygon',
              paint: {
                'line-color': '#ff00ff',
                'line-width': hasLine ? 4 : 3,
              },
            });
          }

          // Calculate centroid from first feature and fly to it
          const center = this.getGeometryCentroid(features[0].geometry);
          const zoom = hasLine && !hasPolygon ? 14.5 : 15.5;
          this.map.flyTo({ center, zoom });
        }
      }
    } catch (e) {
      // No marker for this event
    }
  }

  private getGeometryCentroid(geometry: any): [number, number] {
    let coords: number[][] = [];

    if (geometry.type === 'Polygon') {
      coords = geometry.coordinates[0];
    } else if (geometry.type === 'MultiPolygon') {
      // Use first polygon for centroid
      coords = geometry.coordinates[0][0];
    } else if (geometry.type === 'LineString') {
      coords = geometry.coordinates;
    } else if (geometry.type === 'MultiLineString') {
      // Flatten all line coordinates
      coords = geometry.coordinates.flat();
    }

    if (coords.length === 0) return HULME_CENTER;

    let sumLng = 0, sumLat = 0;
    for (const [lng, lat] of coords) {
      sumLng += lng;
      sumLat += lat;
    }
    return [sumLng / coords.length, sumLat / coords.length];
  }

  onLoad(callback: () => void): void {
    this.map.on('load', callback);
  }
}
