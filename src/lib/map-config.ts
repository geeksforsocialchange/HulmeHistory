// Map configuration - tile sources, eras, and constants

export const HULME_CENTER: [number, number] = [-2.252, 53.465];
export const DEFAULT_ZOOM = 15;

// Era configurations for traced GeoJSON layers
export const ERA_CONFIG = {
  '1871': {
    label: 'Victorian Hulme',
    buildings: { fill: '#6b4c1a', stroke: '#4a3512' },
    blocks: { fill: '#d4c4a8', stroke: '#b8a888' },
  },
  '1990': {
    label: 'Pre-Demolition',
    buildings: { fill: '#4a5a6a', stroke: '#3a4a5a' },
    blocks: { fill: '#8a9aa8', stroke: '#6a7a88' },
  },
} as const;

export type EraKey = keyof typeof ERA_CONFIG;

// Tile sources for historical base maps
export const TILE_SOURCES = {
  carto: {
    type: 'raster' as const,
    tiles: ['https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'],
    tileSize: 256,
    attribution: '© CARTO / OpenStreetMap',
  },
  'os-victorian': {
    type: 'raster' as const,
    tiles: ['https://api.maptiler.com/tiles/uk-osgb10k1888/{z}/{x}/{y}.jpg?key=CHUo97iWgzavgakeZhgh'],
    tileSize: 512,
    maxzoom: 17,
    attribution: '© National Library of Scotland / MapTiler',
  },
  'os-1940s': {
    type: 'raster' as const,
    tiles: ['https://mapseries-tilesets.s3.amazonaws.com/os/britain10knatgrid/{z}/{x}/{y}.png'],
    tileSize: 256,
    maxzoom: 16,
    attribution: '© National Library of Scotland',
  },
  'esri-2014': {
    type: 'raster' as const,
    tiles: ['https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{z}/{y}/{x}'],
    tileSize: 256,
    maxzoom: 19,
    attribution: '© Esri World Imagery Wayback 2014',
  },
} as const;

// Initial layer configurations for base map tiles
export const BASE_LAYERS = [
  {
    id: 'carto',
    type: 'raster' as const,
    source: 'carto',
    paint: { 'raster-opacity': 0.1 },
  },
  {
    id: 'os-victorian',
    type: 'raster' as const,
    source: 'os-victorian',
    paint: { 'raster-opacity': 0 },
  },
  {
    id: 'os-1940s',
    type: 'raster' as const,
    source: 'os-1940s',
    paint: { 'raster-opacity': 0 },
  },
  {
    id: 'esri-2014',
    type: 'raster' as const,
    source: 'esri-2014',
    paint: { 'raster-opacity': 0 },
  },
];

// Slider configuration
export const SLIDER_STOPS = [
  { position: 0, label: '1890s', layer: 'os-victorian' },
  { position: 33, label: '1940s', layer: 'os-1940s' },
  { position: 66, label: '2014', layer: 'esri-2014' },
  { position: 100, label: 'Now', layer: 'carto' },
];

// Determine which era to show based on event year
export function getEraForYear(year: number): EraKey {
  if (year >= 1970) return '1990';
  return '1871';
}
