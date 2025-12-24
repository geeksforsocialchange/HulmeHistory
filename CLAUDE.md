# Hulme History - Project Documentation

A web application exploring the history of Hulme, Manchester through an interactive map and timeline.

## Project Overview

This is an Astro-based static site that displays historical events from Hulme, Manchester on an interactive map. Key features:

- **Interactive Timeline**: Scrollable timeline of events from 1860s-2010s grouped by decade
- **Map with Historical Layers**: Hand-traced historical maps (1871, 1990) showing urban development
- **Historical Base Maps**: Slider to switch between 1890s, 1940s, 2014, and modern tiles
- **Event Details**: Click events to see descriptions, images, and documents
- **Polygon Support**: Events can display Point markers or Polygon/MultiPolygon boundaries
- **Archive Browser**: Searchable catalogue of URBED's Hulme archive (13 boxes of documents)

## Technology Stack

- **Framework**: Astro 5.x (static site generator)
- **Map Library**: MapLibre GL (open-source)
- **Content**: Markdown files with YAML frontmatter
- **Testing**: Vitest
- **Styling**: CSS with Astro scoped styles

## Project Structure

```
/
├── src/
│   ├── content/
│   │   └── config.ts         # Content collection schema (loads from public/events)
│   ├── lib/
│   │   ├── app.ts            # Main app initialization
│   │   ├── map-manager.ts    # Map layers, markers, polygons
│   │   ├── map-config.ts     # Tile sources, eras, slider config
│   │   └── detail-panel.ts   # Event detail panel
│   ├── components/
│   │   ├── Timeline.astro    # Left sidebar timeline
│   │   ├── MapControls.astro # Map controls overlay
│   │   └── DetailPanel.astro # Right detail panel
│   ├── pages/
│   │   ├── index.astro       # Main map/timeline page
│   │   ├── archive.astro     # URBED archive browser
│   │   ├── about.astro       # About page
│   │   └── events/[...slug].astro  # Individual event pages
│   └── layouts/
│       └── Layout.astro      # Base layout
├── public/
│   ├── gis/                  # Hand-traced historical GeoJSON layers
│   │   ├── 1871_blocks.geojson
│   │   ├── 1871_figure_ground.geojson
│   │   ├── 1990_blocks.geojson
│   │   └── 1990_figure_ground.geojson
│   ├── events/               # ALL event content (markdown + assets)
│   │   └── YYYY-event-slug/
│   │       ├── index.md      # Event content (frontmatter + markdown)
│   │       ├── cover.jpg     # Cover image
│   │       ├── file.geojson  # Map marker/polygon
│   │       └── *.pdf         # Additional documents
│   └── urbed-hulme-archive.csv
├── tests/                    # Vitest test suite
│   ├── map-config.test.ts    # Map configuration tests
│   ├── events.test.ts        # Event content validation
│   ├── hulme-park.test.ts    # Hulme Park GeoJSON tests
│   └── geometry.test.ts      # Geometry calculation tests
└── vitest.config.ts
```

## Content Schema

Events are stored as folders in `public/events/` with an `index.md` file and assets together:

```yaml
---
start: 1860           # Required: year event started
end: 1976             # Optional: year event ended
title: "Event Title"  # Required
desc: "Short description"  # Optional: shows in timeline
author: "contributor" # Optional
timeline: buildings   # Optional: buildings | community | news (determines color)
---

Event content in markdown...
```

Assets in the same folder:
- `cover.jpg` or `cover.png` - Main event image
- `file.geojson` - GeoJSON Point, Polygon, or MultiPolygon for map
- Additional images and PDFs appear in lightbox gallery

The content collection uses Astro's glob loader to read from `public/events/` (see `src/content/config.ts`).

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Preview production build
npm run preview
```

## Map Configuration

Located in `src/lib/map-config.ts`:

### Tile Sources

- **carto**: Stamen Toner Lite (modern base)
- **os-victorian**: MapTiler OS 1890s (requires API key)
- **os-1940s**: NLS OS 1940s (free)
- **esri-2014**: ESRI World Imagery Wayback 2014

### Slider Stops

| Position | Label | Layer |
|----------|-------|-------|
| 0 | 1890s | os-victorian |
| 33 | 1940s | os-1940s |
| 66 | 2014 | esri-2014 |
| 100 | Now | carto |

### Era Configuration

Hand-traced GeoJSON layers with styling:
- **1871**: Victorian Hulme (brown/tan colors)
- **1990**: Pre-demolition (blue-grey colors)

### Era Switching Logic

When an event is selected, the slider auto-adjusts:
- Year < 1940: Victorian 1890s (slider 0)
- Year 1940-1989: 1940s (slider 33)
- Year 1990-2013: 2014 aerial (slider 66)
- Year >= 2014: Modern (slider 100)

## Adding New Events

1. Create folder `public/events/YYYY-event-slug/`
2. Add `index.md` with required frontmatter
3. Add assets (`cover.jpg`, `file.geojson`, PDFs) in the same folder

### GeoJSON Support

Events can have Point, Polygon, or MultiPolygon geometries:

**Point** (displays as marker):
```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-2.252, 53.465]
    }
  }]
}
```

**Polygon/MultiPolygon** (displays as magenta outline):
```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": { "name": "Hulme Park", "source": "OpenStreetMap" },
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": [[[[lng, lat], ...]]]
    }
  }]
}
```

## Testing

41 tests covering:
- Map configuration (tile sources, eras, slider stops)
- Event content validation (frontmatter, structure)
- GeoJSON validation (geometry types, coordinates)
- Geometry calculations (centroids, slider logic)

```bash
npm test           # Run once
npm run test:watch # Watch mode
```

## Historical Maps

### Hand-Traced GeoJSON (Primary Data)

The GeoJSON layers in `public/gis/` were manually traced by Delphine Hollebecq from archival maps at Manchester Central Library's Archives+:

- **Figure ground**: Building footprints
- **Blocks**: City blocks/parcels

### Historical OS Tile Layers

| Era | Source | URL Pattern |
|-----|--------|-------------|
| 1890s | MapTiler (API key required) | `api.maptiler.com/tiles/uk-osgb10k1888/{z}/{x}/{y}.jpg` |
| 1940s | NLS (free) | `mapseries-tilesets.s3.amazonaws.com/os/britain10knatgrid/{z}/{x}/{y}.png` |
| 2014 | ESRI Wayback | `wayback.maptiles.arcgis.com/.../tile/10/{z}/{y}/{x}` |

### MapTiler API Note

The API key is embedded in `src/lib/map-config.ts`. Free tier allows 100k requests/month.

## Credits

- Kim Foale - Project manager, code, content
- Emily Crompton - URBED coordinator, content
- Phoebe Queen - Original developer
- Delphine Hollebecq - Maps, archiving, content
- Sylvia Koelling - Archive training

## Potential Improvements

### Content
- Add more polygon boundaries from OpenStreetMap for locations
- Add walking tour routes as GeoJSON LineStrings
- Link archive items to relevant events

### UX
- Add loading indicator when switching map layers
- Clustering for many markers
- Mobile swipeable cards

### Technical
- Move MapTiler API key to environment variable
- Preload adjacent era GeoJSON for smoother transitions
