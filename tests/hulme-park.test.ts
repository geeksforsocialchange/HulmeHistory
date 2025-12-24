import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Hulme Park GeoJSON', () => {
  const geojsonPath = join(__dirname, '../public/events/1990-hulme-park/file.geojson');
  let data: any;

  it('should load the GeoJSON file', () => {
    const content = readFileSync(geojsonPath, 'utf-8');
    data = JSON.parse(content);
    expect(data).toBeDefined();
  });

  it('should be a valid FeatureCollection', () => {
    const content = readFileSync(geojsonPath, 'utf-8');
    data = JSON.parse(content);

    expect(data.type).toBe('FeatureCollection');
    expect(Array.isArray(data.features)).toBe(true);
  });

  it('should have exactly one feature', () => {
    const content = readFileSync(geojsonPath, 'utf-8');
    data = JSON.parse(content);

    expect(data.features).toHaveLength(1);
  });

  it('should be a MultiPolygon geometry', () => {
    const content = readFileSync(geojsonPath, 'utf-8');
    data = JSON.parse(content);

    const geometry = data.features[0].geometry;
    expect(geometry.type).toBe('MultiPolygon');
  });

  it('should have two polygon parts (park split by road)', () => {
    const content = readFileSync(geojsonPath, 'utf-8');
    data = JSON.parse(content);

    const coordinates = data.features[0].geometry.coordinates;
    expect(coordinates).toHaveLength(2);
  });

  it('should have coordinates in Hulme area', () => {
    const content = readFileSync(geojsonPath, 'utf-8');
    data = JSON.parse(content);

    // Hulme is roughly: lat 53.46-53.48, lng -2.26 to -2.24
    const coordinates = data.features[0].geometry.coordinates;

    for (const polygon of coordinates) {
      for (const ring of polygon) {
        for (const [lng, lat] of ring) {
          expect(lng).toBeGreaterThan(-2.26);
          expect(lng).toBeLessThan(-2.24);
          expect(lat).toBeGreaterThan(53.46);
          expect(lat).toBeLessThan(53.48);
        }
      }
    }
  });

  it('should have OpenStreetMap as source in properties', () => {
    const content = readFileSync(geojsonPath, 'utf-8');
    data = JSON.parse(content);

    const properties = data.features[0].properties;
    expect(properties.source).toBe('OpenStreetMap');
    expect(properties.name).toBe('Hulme Park');
  });

  it('should have closed polygon rings (first coord equals last)', () => {
    const content = readFileSync(geojsonPath, 'utf-8');
    data = JSON.parse(content);

    const coordinates = data.features[0].geometry.coordinates;

    for (const polygon of coordinates) {
      for (const ring of polygon) {
        const first = ring[0];
        const last = ring[ring.length - 1];
        expect(first[0]).toBeCloseTo(last[0], 6);
        expect(first[1]).toBeCloseTo(last[1], 6);
      }
    }
  });
});
