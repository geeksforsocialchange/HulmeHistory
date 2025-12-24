import { describe, it, expect } from 'vitest';

// Extracted centroid calculation logic for testing
function getGeometryCentroid(geometry: any): [number, number] {
  const HULME_CENTER: [number, number] = [-2.252, 53.465];
  let coords: number[][] = [];

  if (geometry.type === 'Polygon') {
    coords = geometry.coordinates[0];
  } else if (geometry.type === 'MultiPolygon') {
    // Use first polygon for centroid
    coords = geometry.coordinates[0][0];
  }

  if (coords.length === 0) return HULME_CENTER;

  let sumLng = 0, sumLat = 0;
  for (const [lng, lat] of coords) {
    sumLng += lng;
    sumLat += lat;
  }
  return [sumLng / coords.length, sumLat / coords.length];
}

describe('Geometry Centroid Calculation', () => {
  describe('Point geometry', () => {
    it('should return HULME_CENTER for unknown geometry types', () => {
      const geometry = { type: 'Point', coordinates: [-2.25, 53.47] };
      const centroid = getGeometryCentroid(geometry);
      expect(centroid).toEqual([-2.252, 53.465]);
    });
  });

  describe('Polygon geometry', () => {
    it('should calculate centroid of a simple square', () => {
      const geometry = {
        type: 'Polygon',
        coordinates: [[
          [0, 0],
          [2, 0],
          [2, 2],
          [0, 2],
          [0, 0],
        ]],
      };
      const centroid = getGeometryCentroid(geometry);
      expect(centroid[0]).toBeCloseTo(0.8, 1); // Average of 0,2,2,0,0 = 4/5
      expect(centroid[1]).toBeCloseTo(0.8, 1);
    });

    it('should calculate centroid of a triangle', () => {
      const geometry = {
        type: 'Polygon',
        coordinates: [[
          [0, 0],
          [3, 0],
          [0, 3],
          [0, 0],
        ]],
      };
      const centroid = getGeometryCentroid(geometry);
      expect(centroid[0]).toBeCloseTo(0.75, 2); // (0+3+0+0)/4
      expect(centroid[1]).toBeCloseTo(0.75, 2); // (0+0+3+0)/4
    });
  });

  describe('MultiPolygon geometry', () => {
    it('should use first polygon for centroid calculation', () => {
      const geometry = {
        type: 'MultiPolygon',
        coordinates: [
          // First polygon - square at origin
          [[
            [0, 0],
            [2, 0],
            [2, 2],
            [0, 2],
            [0, 0],
          ]],
          // Second polygon - square offset (should be ignored)
          [[
            [10, 10],
            [12, 10],
            [12, 12],
            [10, 12],
            [10, 10],
          ]],
        ],
      };
      const centroid = getGeometryCentroid(geometry);
      // Should be centroid of first polygon, not second
      expect(centroid[0]).toBeLessThan(5);
      expect(centroid[1]).toBeLessThan(5);
    });
  });

  describe('Empty geometry', () => {
    it('should return HULME_CENTER for empty polygon', () => {
      const geometry = { type: 'Polygon', coordinates: [[]] };
      const centroid = getGeometryCentroid(geometry);
      expect(centroid).toEqual([-2.252, 53.465]);
    });
  });

  describe('Real Hulme Park coordinates', () => {
    it('should calculate centroid within Hulme area', () => {
      // Simplified Hulme Park polygon (main section)
      const geometry = {
        type: 'Polygon',
        coordinates: [[
          [-2.2541542, 53.469999],
          [-2.253626, 53.4691239],
          [-2.2504388, 53.4686923],
          [-2.2523645, 53.4705587],
          [-2.2541542, 53.469999],
        ]],
      };
      const centroid = getGeometryCentroid(geometry);

      // Should be roughly in the middle of Hulme Park
      expect(centroid[0]).toBeGreaterThan(-2.26);
      expect(centroid[0]).toBeLessThan(-2.24);
      expect(centroid[1]).toBeGreaterThan(53.46);
      expect(centroid[1]).toBeLessThan(53.48);
    });
  });
});

describe('Slider Era Logic', () => {
  function getSliderValueForYear(year: number): number {
    if (year < 1940) return 0;       // Victorian 1890s
    if (year < 1990) return 33;      // 1940s
    if (year < 2014) return 66;      // 2014 aerial
    return 100;                       // Modern
  }

  it('should return 0 for Victorian era events', () => {
    expect(getSliderValueForYear(1860)).toBe(0);
    expect(getSliderValueForYear(1900)).toBe(0);
    expect(getSliderValueForYear(1939)).toBe(0);
  });

  it('should return 33 for mid-20th century events', () => {
    expect(getSliderValueForYear(1940)).toBe(33);
    expect(getSliderValueForYear(1970)).toBe(33);
    expect(getSliderValueForYear(1989)).toBe(33);
  });

  it('should return 66 for 1990s-2000s events', () => {
    expect(getSliderValueForYear(1990)).toBe(66);
    expect(getSliderValueForYear(2000)).toBe(66);
    expect(getSliderValueForYear(2013)).toBe(66);
  });

  it('should return 100 for modern events', () => {
    expect(getSliderValueForYear(2014)).toBe(100);
    expect(getSliderValueForYear(2020)).toBe(100);
    expect(getSliderValueForYear(2025)).toBe(100);
  });
});
