import { CircleLayer } from 'react-map-gl'

export const treeStyle: CircleLayer = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf',
  },
}
