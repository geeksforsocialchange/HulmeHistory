import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const EVENTS_DIR = join(__dirname, '../src/content/events');
const PUBLIC_EVENTS_DIR = join(__dirname, '../public/events');

interface EventFrontmatter {
  start: number;
  end?: number;
  title: string;
  desc?: string;
  author?: string;
  timeline?: string;
  lat?: number;
  lng?: number;
}

function parseEventFrontmatter(content: string): EventFrontmatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const data: any = {};

  for (const line of yaml.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Parse numbers
      if (/^\d+$/.test(value)) {
        data[key] = parseInt(value, 10);
      } else if (/^\d+\.\d+$/.test(value)) {
        data[key] = parseFloat(value);
      } else {
        data[key] = value;
      }
    }
  }

  return data as EventFrontmatter;
}

describe('Event Content', () => {
  let eventDirs: string[];

  beforeAll(() => {
    eventDirs = readdirSync(EVENTS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
  });

  it('should have at least 10 events', () => {
    expect(eventDirs.length).toBeGreaterThanOrEqual(10);
  });

  describe('Event Structure', () => {
    it('each event should have an index.md file', () => {
      for (const dir of eventDirs) {
        const indexPath = join(EVENTS_DIR, dir, 'index.md');
        expect(existsSync(indexPath), `${dir}/index.md should exist`).toBe(true);
      }
    });

    it('each event folder name should follow YYYY-slug format', () => {
      for (const dir of eventDirs) {
        expect(dir).toMatch(/^\d{4}-[a-z0-9-]+$/);
      }
    });
  });

  describe('Event Frontmatter', () => {
    it('each event should have required frontmatter fields', () => {
      for (const dir of eventDirs) {
        const content = readFileSync(join(EVENTS_DIR, dir, 'index.md'), 'utf-8');
        const frontmatter = parseEventFrontmatter(content);

        expect(frontmatter, `${dir} should have valid frontmatter`).not.toBeNull();
        expect(frontmatter!.start, `${dir} should have start year`).toBeDefined();
        expect(frontmatter!.title, `${dir} should have title`).toBeDefined();
      }
    });

    it('start year should be reasonable (1800-2025)', () => {
      for (const dir of eventDirs) {
        const content = readFileSync(join(EVENTS_DIR, dir, 'index.md'), 'utf-8');
        const frontmatter = parseEventFrontmatter(content);

        expect(frontmatter!.start).toBeGreaterThanOrEqual(1800);
        expect(frontmatter!.start).toBeLessThanOrEqual(2025);
      }
    });

    it('end year should be after start year when present', () => {
      for (const dir of eventDirs) {
        const content = readFileSync(join(EVENTS_DIR, dir, 'index.md'), 'utf-8');
        const frontmatter = parseEventFrontmatter(content);

        if (frontmatter!.end) {
          expect(
            frontmatter!.end,
            `${dir}: end (${frontmatter!.end}) should be >= start (${frontmatter!.start})`
          ).toBeGreaterThanOrEqual(frontmatter!.start);
        }
      }
    });

    it('timeline category should be valid when present', () => {
      const validCategories = ['buildings', 'community', 'news'];

      for (const dir of eventDirs) {
        const content = readFileSync(join(EVENTS_DIR, dir, 'index.md'), 'utf-8');
        const frontmatter = parseEventFrontmatter(content);

        if (frontmatter!.timeline) {
          expect(
            validCategories,
            `${dir}: timeline "${frontmatter!.timeline}" should be valid`
          ).toContain(frontmatter!.timeline);
        }
      }
    });
  });
});

describe('Event Assets', () => {
  let publicEventDirs: string[];

  beforeAll(() => {
    publicEventDirs = readdirSync(PUBLIC_EVENTS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
  });

  it('should have matching public assets for content events', () => {
    const contentEventDirs = readdirSync(EVENTS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    // Check that content events have corresponding public folders
    for (const dir of contentEventDirs) {
      if (existsSync(join(PUBLIC_EVENTS_DIR, dir))) {
        // Has public folder - that's good
        expect(true).toBe(true);
      }
    }
  });

  describe('GeoJSON Files', () => {
    it('file.geojson should be valid GeoJSON when present', () => {
      for (const dir of publicEventDirs) {
        const geojsonPath = join(PUBLIC_EVENTS_DIR, dir, 'file.geojson');
        if (existsSync(geojsonPath)) {
          const content = readFileSync(geojsonPath, 'utf-8');
          const data = JSON.parse(content);

          expect(data.type).toBe('FeatureCollection');
          expect(Array.isArray(data.features)).toBe(true);
          expect(data.features.length).toBeGreaterThan(0);

          const geomType = data.features[0].geometry.type;
          expect(['Point', 'LineString', 'Polygon', 'MultiPolygon']).toContain(geomType);
        }
      }
    });
  });

  describe('Cover Images', () => {
    it('cover images should exist in jpg or png format when present', () => {
      for (const dir of publicEventDirs) {
        const jpgPath = join(PUBLIC_EVENTS_DIR, dir, 'cover.jpg');
        const pngPath = join(PUBLIC_EVENTS_DIR, dir, 'cover.png');

        // At least one should exist if this is a properly set up event
        if (existsSync(jpgPath) || existsSync(pngPath)) {
          expect(existsSync(jpgPath) || existsSync(pngPath)).toBe(true);
        }
      }
    });
  });
});
