# Historical Map Sources Research

Research into available historical map tile sources for Hulme History project.

## Currently Integrated

### OS Victorian (1888-1913)
- **Source**: National Library of Scotland via MapTiler
- **URL**: `https://api.maptiler.com/tiles/uk-osgb10k1888/{z}/{x}/{y}.jpg?key=API_KEY`
- **Scale**: 1:10,560 (Six-Inch to the Mile)
- **Coverage**: All of Great Britain
- **API Key Required**: Yes (MapTiler free tier: 100k requests/month)
- **Status**: ✅ Integrated

### OS 1940s-1960s
- **Source**: National Library of Scotland (S3 hosted)
- **URL**: `https://mapseries-tilesets.s3.amazonaws.com/os/britain10knatgrid/{z}/{x}/{y}.png`
- **Scale**: 1:10,560 National Grid
- **Coverage**: Most of Great Britain
- **API Key Required**: No (free)
- **Status**: ✅ Integrated

### Esri World Imagery 2014
- **Source**: Esri World Imagery Wayback
- **URL**: `https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{z}/{y}/{x}`
- **Date**: February 20, 2014
- **Note**: Uses `{z}/{y}/{x}` format (Esri convention)
- **Status**: ✅ Integrated

### Modern Base Map
- **Source**: CARTO Light (no labels)
- **URL**: `https://basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png`
- **Status**: ✅ Integrated

---

## The 1990s Gap

There is no freely available tile service for 1990s mapping of the UK. This is a significant gap between the 1940s-60s OS maps and modern satellite imagery.

### Why This Matters
- The Hulme Crescents were built 1968-1972
- They were demolished 1993-1995 (City Challenge)
- The 1940s-60s OS maps show pre-Crescents Hulme
- Modern maps show post-demolition Hulme
- **No tile service covers the Crescents era (1972-1993)**

---

## Known Aerial Photos of Hulme Crescents

### Aerofilms 1971
- **Source**: Historic England Archive (EAW217722)
- **Date**: August 17, 1971
- **View**: https://artsandculture.google.com/asset/hulme-crescents-hulme-manchester-aerofilms-ltd/dAHCMk3pxgOOCQ
- **Notes**: Shows Crescents shortly before completion (built 1968-1972)

### Manchester Archives Flickr
- **URL**: https://www.flickr.com/photos/manchesterarchiveplus/albums/72157636253411366/
- **Collection**: "The Hulme Crescents - Demolition and Murals" (35 photos)
- **Photographers**: Len Grant, Paul Tomlin, Image Aviation, Harry Milligan
- **Content**: Includes 1992 aerial view, demolition photos 1993-1994

### Rylands Collections (University of Manchester)
- **Collection**: Richard Davis "Images of Hulme 1980-90"
- **URL**: https://rylandscollections.com/2020/12/15/new-collection-announcement-images-of-hulme-in-the-80s-and-90s/
- **Content**: Street-level photos of Crescents and surroundings

---

## Sources Investigated (Not Available as Tiles)

### NCAP Millennium Mapping
- **URL**: https://www.ncap.org/image-collection/millennium-mapping
- **Coverage**: Complete UK colour aerial photography
- **Dates**: 1999-2000
- **Resolution**: 0.25m ground resolution at 1:10,000 scale
- **Access**: Paid service, contact required
- **Tile API**: ❌ None available
- **Notes**:
  - Created by Getmapping plc (formerly Millennium Mapping Company)
  - 70% of England photographed in 1999
  - Remainder completed by end of 2000
  - Collection transferred to NCAP in 2015

### Google Earth Historical Imagery
- **URL**: https://earth.google.com
- **Coverage**: Variable, depends on location
- **Dates**: Various, potentially 1990s for UK urban areas
- **Access**: Google Earth Pro desktop app only
- **Tile API**: ❌ Not available (terms prohibit tile access)
- **Notes**:
  - Historical imagery accessed via timeline slider in desktop app
  - Cannot be extracted as tiles for web use
  - Worth checking for reference/research purposes

### Esri World Imagery Wayback
- **URL**: https://livingatlas.arcgis.com/wayback/
- **Coverage**: Global
- **Dates**: February 2014 onwards only
- **Tile API**: ✅ Available but no 1990s coverage
- **Notes**: Only archives imagery from 2014, not useful for 1990s

### Britain from Above (Aerofilms)
- **URL**: https://www.britainfromabove.org.uk/
- **Coverage**: Britain
- **Dates**: 1919-1953 only
- **Tile API**: ❌ None (browse interface only)
- **Notes**:
  - 95,000 images digitised
  - Historic England Archive holds 1.26 million images (1919-2006)
  - Post-1953 images not publicly tiled

### Historic England Aerial Photo Explorer
- **URL**: https://historicengland.org.uk/images-books/archive/collections/aerial-photos/
- **Coverage**: England
- **Collection**: 6 million photographs
- **Tile API**: ❌ None available
- **Notes**: Individual image viewing only

### Manchester City Council Archives
- **URL**: https://www.manchester.gov.uk/info/448/archives_and_local_history
- **Holdings**: Documentary Photography Archive (mid-1980s to 1990s)
- **Access**: Physical archive at Central Library
- **Tile API**: ❌ None
- **Open Data Portal**: https://open-data-mcr-council.hub.arcgis.com/

### Skyviews Aerial Archives
- **URL**: https://skyviewsarchives.co.uk/
- **Coverage**: Great Britain
- **Dates**: Early 1960s to late 1990s
- **Collection**: 10+ million images
- **Access**: Commercial service
- **Tile API**: ❌ None

---

## Other NLS Tile Layers (Free, No API Key)

These are available but don't cover the 1990s gap:

| Layer | URL | Coverage | Era |
|-------|-----|----------|-----|
| OS 6-inch First Edition | `https://mapseries-tilesets.s3.amazonaws.com/os/6inchfirst/{z}/{x}/{y}.png` | Scotland only | 1842-1882 |
| OS 25-inch Scotland | `https://mapseries-tilesets.s3.amazonaws.com/25_inch/scotland_1/{z}/{x}/{y}.png` | Scotland only | 1892-1905 |
| London 1940s | `https://mapseries-tilesets.s3.amazonaws.com/london_1940s/{z}/{x}/{y}.png` | London/SE England | 1947-1963 |

---

## MapTiler NLS Layers (Free Tier with API Key)

Available via MapTiler with free account (100k requests/month):

| Tileset ID | Description | Era |
|------------|-------------|-----|
| `uk-osgb10k1888` | OS Six-Inch England & Wales | 1888-1913 |
| `uk-osgb63k1885` | OS One-Inch (Hills edition) | 1885-1903 |
| `uk-osgb63k1955` | OS One-Inch Seventh Series | 1955-1961 |
| `uk-osgb1919` | Multi-scale layer | 1920s-1940s |
| `uk-oslondon1k1893` | London Five-Foot | 1893-1896 |

URL format: `https://api.maptiler.com/tiles/{tileset-id}/{z}/{x}/{y}.jpg?key=YOUR_KEY`

---

## Recommendations

### For the 1990s Era
1. **Keep the hand-traced 1990 GeoJSON** - This is bespoke data showing building footprints that doesn't exist elsewhere
2. **Consider georeferencing** a single aerial photo from Manchester Archives if obtainable
3. **Check Google Earth Pro** for specific historical imagery dates available for Hulme

### Future Possibilities
- Contact NCAP about potential tile access to Millennium Mapping
- Check if Manchester City Council's Open Data portal adds historical imagery
- Monitor if Esri Wayback expands to include earlier imagery

---

## References

- NLS Georeferenced Maps: https://maps.nls.uk/geo/explore/
- NLS API Documentation: https://maps.nls.uk/projects/api/
- MapTiler NLS Layers: https://www.maptiler.com/nls/
- OSM Wiki - NLS: https://wiki.openstreetmap.org/wiki/National_Library_of_Scotland
- NCAP Collections: https://www.ncap.org/image-collection

---

*Last updated: December 2024*
