import { MapboxStyle } from 'react-map-gl'

export const basemapStyle: MapboxStyle = {
  version: 8,
  glyphs: '/fonts/{fontstack}/{range}.pbf',
  sources: {
    basemap: {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png'],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: 'basemap',
      type: 'raster',
      source: 'basemap',
    },
  ],
}
