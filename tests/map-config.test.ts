import { describe, it, expect } from 'vitest';
import {
  HULME_CENTER,
  DEFAULT_ZOOM,
  ERA_CONFIG,
  TILE_SOURCES,
  BASE_LAYERS,
  SLIDER_STOPS,
  getEraForYear,
} from '../src/lib/map-config';

describe('Map Configuration', () => {
  describe('HULME_CENTER', () => {
    it('should be valid coordinates for Hulme, Manchester', () => {
      const [lng, lat] = HULME_CENTER;
      expect(lng).toBeCloseTo(-2.252, 2);
      expect(lat).toBeCloseTo(53.465, 2);
    });
  });

  describe('DEFAULT_ZOOM', () => {
    it('should be a reasonable zoom level for neighborhood view', () => {
      expect(DEFAULT_ZOOM).toBeGreaterThanOrEqual(14);
      expect(DEFAULT_ZOOM).toBeLessThanOrEqual(17);
    });
  });

  describe('ERA_CONFIG', () => {
    it('should have 1871 and 1990 eras', () => {
      expect(ERA_CONFIG).toHaveProperty('1871');
      expect(ERA_CONFIG).toHaveProperty('1990');
    });

    it('should have valid color configurations for each era', () => {
      for (const [era, config] of Object.entries(ERA_CONFIG)) {
        expect(config.label).toBeTruthy();
        expect(config.buildings.fill).toMatch(/^#[0-9a-f]{6}$/i);
        expect(config.buildings.stroke).toMatch(/^#[0-9a-f]{6}$/i);
        expect(config.blocks.fill).toMatch(/^#[0-9a-f]{6}$/i);
        expect(config.blocks.stroke).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });
  });

  describe('TILE_SOURCES', () => {
    it('should have all required tile sources', () => {
      expect(TILE_SOURCES).toHaveProperty('carto');
      expect(TILE_SOURCES).toHaveProperty('os-victorian');
      expect(TILE_SOURCES).toHaveProperty('os-1940s');
      expect(TILE_SOURCES).toHaveProperty('esri-2014');
    });

    it('should have valid tile URL templates', () => {
      for (const [name, source] of Object.entries(TILE_SOURCES)) {
        expect(source.type).toBe('raster');
        expect(source.tiles).toHaveLength(1);
        expect(source.tiles[0]).toContain('{z}');
        expect(source.tiles[0]).toContain('{x}');
        expect(source.tiles[0]).toContain('{y}');
      }
    });

    it('should have valid tile sizes', () => {
      for (const source of Object.values(TILE_SOURCES)) {
        expect([256, 512]).toContain(source.tileSize);
      }
    });
  });

  describe('BASE_LAYERS', () => {
    it('should have layers for each tile source', () => {
      const layerIds = BASE_LAYERS.map(l => l.id);
      expect(layerIds).toContain('carto');
      expect(layerIds).toContain('os-victorian');
      expect(layerIds).toContain('os-1940s');
      expect(layerIds).toContain('esri-2014');
    });

    it('should have valid layer configurations', () => {
      for (const layer of BASE_LAYERS) {
        expect(layer.type).toBe('raster');
        expect(layer.source).toBeTruthy();
        expect(layer.paint).toHaveProperty('raster-opacity');
      }
    });
  });

  describe('SLIDER_STOPS', () => {
    it('should have 4 stops from 0 to 100', () => {
      expect(SLIDER_STOPS).toHaveLength(4);
      expect(SLIDER_STOPS[0].position).toBe(0);
      expect(SLIDER_STOPS[SLIDER_STOPS.length - 1].position).toBe(100);
    });

    it('should be in ascending order', () => {
      for (let i = 1; i < SLIDER_STOPS.length; i++) {
        expect(SLIDER_STOPS[i].position).toBeGreaterThan(SLIDER_STOPS[i - 1].position);
      }
    });

    it('should have labels and layers for each stop', () => {
      for (const stop of SLIDER_STOPS) {
        expect(stop.label).toBeTruthy();
        expect(stop.layer).toBeTruthy();
      }
    });
  });

  describe('getEraForYear', () => {
    it('should return 1871 for years before 1970', () => {
      expect(getEraForYear(1860)).toBe('1871');
      expect(getEraForYear(1900)).toBe('1871');
      expect(getEraForYear(1969)).toBe('1871');
    });

    it('should return 1990 for years 1970 and after', () => {
      expect(getEraForYear(1970)).toBe('1990');
      expect(getEraForYear(1985)).toBe('1990');
      expect(getEraForYear(2000)).toBe('1990');
    });
  });
});
