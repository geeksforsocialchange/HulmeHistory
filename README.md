# Hulme History

An interactive web application exploring the history of Hulme, Manchester through maps and a timeline.

## Features

- **Interactive Timeline**: Events from 1860s-2010s grouped by decade
- **Historical Map Layers**: Hand-traced GeoJSON layers showing Hulme in 1871 and 1990
- **Historical Base Maps**: OS maps from 1890s, 1940s, 2014 aerial, and modern tiles
- **Event Details**: Markdown content with images, PDFs, and map markers/polygons
- **Archive Browser**: Searchable catalogue of URBED's Hulme archive

## Tech Stack

- **Framework**: [Astro](https://astro.build/) 5.x
- **Map Library**: [MapLibre GL](https://maplibre.org/) (open-source)
- **Content**: Markdown with YAML frontmatter
- **Testing**: [Vitest](https://vitest.dev/)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
src/
├── content/events/          # Event folders with markdown + assets
│   └── YYYY-event-slug/
│       ├── index.md         # Event content
│       ├── cover.jpg        # Cover image
│       ├── file.geojson     # Map marker/polygon
│       └── *.pdf            # Additional documents
├── lib/                     # TypeScript modules
│   ├── app.ts               # Main app initialization
│   ├── map-manager.ts       # Map layer and marker handling
│   └── map-config.ts        # Tile sources and era config
├── components/              # Astro components
└── pages/                   # Routes

public/
├── gis/                     # Hand-traced historical GeoJSON layers
└── events/                  # Static event assets (served via URL)

tests/                       # Vitest test suite
```

## Adding Events

1. Create a folder in `src/content/events/` named `YYYY-event-slug/`
2. Add `index.md` with frontmatter:

   ```yaml
   ---
   start: 1991
   end: 1997 # Optional
   title: "Event Title"
   desc: "Short description"
   author: "contributor" # Optional
   timeline: buildings # buildings | community | news
   ---
   Event content in markdown...
   ```

3. Add assets to the same folder:

   - `cover.jpg` or `cover.png` - Cover image
   - `file.geojson` - GeoJSON Point, Polygon, or MultiPolygon for map
   - Additional images and PDFs

4. Copy assets to `public/events/YYYY-event-slug/` for URL access

## Map Eras

The slider switches between historical base maps:

- **1890s**: Victorian OS maps (MapTiler)
- **1940s**: Mid-century OS maps (NLS)
- **2014**: ESRI World Imagery Wayback
- **Now**: Stamen Toner Lite

Hand-traced GeoJSON layers (1871, 1990) can be toggled independently.

## Contributing

We welcome contributions! You can:

- Submit a pull request with new events or improvements
- Email kim@gfsc.studio with content or corrections

## Credits

- **Project Manager & Code**: Kim Foale
- **URBED Coordinator**: Emily Crompton
- **Original Developer**: Phoebe Queen
- **Maps**: Delphine Hollebecq (hand-traced from Manchester Central Library archives)
- **Archive Training**: Sylvia Kölling
- **Content**: Delphine Hollebecq, Emily Crompton, Kim Foale, Sylvia Kölling

## Thanks

- Archives+ and Manchester City Council
- URBED
- Cassowary Project
- National Library of Scotland (historical tile layers)
- OpenStreetMap contributors

## License

Content and hand-traced maps are original work. See individual assets for licensing.
