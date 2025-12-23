# Hulme History - Project Documentation

A web application exploring the history of Hulme, Manchester through an interactive map and timeline.

## Project Overview

This is an Astro-based static site that displays historical events from Hulme, Manchester on an interactive map. Key features:

- **Interactive Timeline**: Scrollable timeline of events from 1860s-2010s grouped by decade
- **Map with Historical Layers**: Three hand-traced historical maps (1871, 1990, 2015) showing urban development
- **Event Details**: Click events to see descriptions, images, and documents
- **Archive Browser**: Searchable catalogue of URBED's Hulme archive (13 boxes of documents)

## Technology Stack

- **Framework**: Astro 5.x (static site generator)
- **Map Library**: MapLibre GL (open-source, no API key required)
- **Content**: Markdown files with YAML frontmatter
- **Styling**: CSS with Astro scoped styles

## Project Structure

```
/
├── src/
│   ├── content/
│   │   └── events/           # Markdown files for historical events
│   ├── pages/
│   │   ├── index.astro       # Main map/timeline page
│   │   ├── archive.astro     # URBED archive browser
│   │   ├── about.astro       # About page
│   │   ├── contact.astro     # Contact page
│   │   └── events/[...slug].astro  # Individual event pages
│   └── layouts/
│       └── Layout.astro      # Base layout
├── public/
│   ├── gis/                  # GeoJSON files for historical map layers
│   │   ├── 1871_blocks.geojson
│   │   ├── 1871_figure_ground.geojson
│   │   ├── 1990_blocks.geojson
│   │   ├── 1990_figure_ground.geojson
│   │   └── 2015_blocks.geojson
│   ├── events/               # Event assets (images, PDFs, GeoJSON points)
│   │   └── [event-id]/
│   │       ├── cover.jpg     # Event cover image
│   │       ├── file.geojson  # Map marker location
│   │       └── *.jpg/*.pdf   # Additional resources
│   └── urbed-hulme-archive.csv  # Archive catalogue data
└── package.json
```

## Content Schema

Events are stored as Markdown files in `src/content/events/` with this frontmatter:

```yaml
---
start: 1860           # Required: year event started
end: 1976             # Optional: year event ended
title: "Event Title"  # Required
desc: "Short description"  # Optional: shows in timeline
author: "contributor" # Optional
timeline: buildings   # Optional: buildings | community | news (determines color)
lat: 53.468           # Optional: for map marker
lng: -2.260           # Optional: for map marker
---
```

Event assets go in `public/events/[event-id]/`:
- `cover.jpg` or `cover.png` - Main event image
- `file.geojson` - Point location for map marker
- Additional images and PDFs appear in lightbox gallery

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Map Configuration

The map shows Hulme, Manchester centered at `[-2.260, 53.468]` with bounds restricting pan/zoom to the local area.

Three historical layers are available:
- **1871**: Buildings and blocks traced from Victorian-era maps
- **1990**: Pre-City Challenge redevelopment layout
- **2015**: Modern block layout

The map automatically switches layers based on the selected event's year:
- Before 1970: Shows 1871 map
- 1970-1993: Shows 1990 map
- 1994+: Shows 2015 map

## Adding New Events

1. Create a Markdown file in `src/content/events/` named `YYYY-event-slug.md`
2. Add required frontmatter (start year, title)
3. Write event content in Markdown
4. Optionally create `public/events/YYYY-event-slug/` folder with:
   - `cover.jpg` - Cover image
   - `file.geojson` - GeoJSON Point for map marker
   - Additional images/PDFs

## Historical Maps

### Hand-Traced GeoJSON (Primary Data)

The GeoJSON layers in `public/gis/` were manually traced by Delphine Hollebecq from archival maps at Manchester Central Library's Archives+. These show:

- **Figure ground**: Building footprints
- **Blocks**: City blocks/parcels

This is bespoke data that doesn't exist elsewhere - valuable for showing individual building polygons.

### Historical OS Tile Layers (Base Maps)

Two optional historical Ordnance Survey base maps are available as toggles:

#### OS 1890s (Victorian, 1888-1913)
- **Source**: National Library of Scotland via MapTiler
- **URL**: `https://api.maptiler.com/tiles/uk-osgb10k1888/{z}/{x}/{y}.jpg?key=CHUo97iWgzavgakeZhgh`
- **Coverage**: All of Great Britain at 1:10,560 scale
- **Best for**: 1871 era - shows the original Victorian mapping Delphine traced from
- **API Key**: MapTiler free tier (100k requests/month)

#### OS 1940s (1940s-1960s)
- **Source**: National Library of Scotland (free, no API key)
- **URL**: `https://mapseries-tilesets.s3.amazonaws.com/os/britain10knatgrid/{z}/{x}/{y}.png`
- **Coverage**: All of Great Britain at 1:10,560 scale
- **Best for**: Context for the 1990 era

### Other Historical Map Resources

- **University of Manchester Library**: Scanned Victorian Manchester maps (not as tiles) - https://www.library.manchester.ac.uk/rylands/special-collections/subject-areas/map-collections-travel-and-discovery/online-map-collection/
- **Open Historical Map**: Community-contributed historical vector data - https://github.com/Open-Historical-Map-Labs/openhistoricaltiles
- **NLS Georeferenced Maps**: https://maps.nls.uk/geo/explore/

### MapTiler API Note

The API key `CHUo97iWgzavgakeZhgh` is embedded in `src/pages/index.astro`. For production, consider moving to an environment variable. Free tier allows 100k tile requests/month.

## Credits

- Kim Foale - Project manager, code, content
- Emily Crompton - URBED coordinator, content
- Phoebe Queen - Original developer
- Delphine Hollebecq - Maps, archiving, content
- Sylvia Koelling - Archive training

See `/about` page for full credits and resource links.

## Potential Improvements

### API Key Security
- Move MapTiler API key to environment variable (`PUBLIC_MAPTILER_KEY`)
- Use Astro's `import.meta.env` to access at build time

### Historical Map Integration
- Consider auto-enabling OS 1890s layer when viewing 1871 era events
- Add opacity slider for historical base maps to blend with traced GeoJSON
- OS One-Inch maps (1885-1903) available via MapTiler tileset `uk-osgb63k1885` - lower detail but wider zoom range

### Map UX Improvements
- Add loading indicator when switching map layers
- Preload adjacent era GeoJSON for smoother transitions
- Consider clustering markers when many events are visible
- Add map legend explaining the traced layer colors

### Content Enhancements
- Many events lack `file.geojson` markers - could geocode from addresses
- Add more event images from URBED archive
- Link archive items to relevant events
- Add walking tour routes as GeoJSON LineStrings

### Mobile Experience
- Current responsive layout puts timeline below map on mobile
- Consider swipeable cards for events on small screens
- Add "locate me" button for on-site visits

### Accessibility
- Add keyboard navigation for timeline events
- Ensure map controls are keyboard accessible
- Add ARIA labels to interactive elements

## Development Notes

### Astro Dev Toolbar
Disabled in `astro.config.mjs` due to interference with map interactions:
```javascript
devToolbar: { enabled: false }
```

### Map Bounds
Map is centered on Hulme at `[-2.252, 53.465]` with no bounds restrictions to allow free exploration.

### Era Switching Logic
- Year < 1970: Victorian era (1871 layers)
- Year 1970-1993: Pre-demolition (1990 layers)
- Year >= 1994: Modern (2015 layers)

## Session Notes - December 2024

### Historical Aerial Photos

Downloaded two aerial photos of the Crescents area:

1. **1971 Aerofilms** (`public/images/aerial-1971.jpg`)
   - Source: Historic England Archive via Google Arts & Culture
   - URL: https://artsandculture.google.com/asset/hulme-crescents-hulme-manchester-aerofilms-ltd/dAHCMk3pxgOOCQ
   - Shows Crescents shortly after construction
   - Oblique angle (looking NE)

2. **2003 Manchester Archives** (`public/images/aerial-2003.jpg`)
   - Source: Manchester Archives Flickr
   - URL: https://www.flickr.com/photos/manchesterarchiveplus/albums/72157636253411366/
   - Shows cleared demolition sites (Crescents demolished 1993-95)
   - Looking south, Birley Fields and former Crescents site visible

**Note**: These are oblique aerial photos that cannot be accurately overlaid on the map without proper georeferencing in QGIS (requires scale, rotate, skew, perspective correction). Plan is to show them as reference photos in the detail panel instead of map overlays.

### Pending Tasks

- [ ] Add historical aerial photos to detail panel as reference images (not map overlays)
- [ ] Link photos to their source pages (Flickr, Google Arts & Culture)
- [ ] Consider adding more photos from Manchester Archives Flickr album (35 photos of Crescents demolition/murals)
