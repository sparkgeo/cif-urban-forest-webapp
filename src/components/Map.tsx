import ReactMapGl, {
  CircleLayer,
  Layer,
  LngLatBounds,
  MapboxEvent,
  Source,
  ViewStateChangeEvent,
} from 'react-map-gl'
import { FeatureCollection } from 'geojson'
import { useState } from 'react'
import { theme } from '../styles/theme'

interface MapProps {
  bounds: LngLatBounds | undefined
  setBounds: (bounds: LngLatBounds) => void
}
const INITIAL_VIEW_STATE = {
  longitude: -122.4,
  latitude: 37.8,
  zoom: 14,
}
const layerStyle: CircleLayer = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf',
  },
}

export function Map({ bounds, setBounds }: MapProps) {
  const [trees, setTrees] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-122.4, 37.8] } },
    ],
  })

  const updateTrees = (event: ViewStateChangeEvent | MapboxEvent) => {
    console.log('foo', event.target.getBounds())
    const mapBounds = event.target.getBounds()
    const minLat = mapBounds.getEast()
    const minLng = mapBounds.getSouth()
    const maxLat = mapBounds.getWest()
    const maxLng = mapBounds.getNorth()

    const treeApiUrl = `${import.meta.env.VITE_CIF_URBAN_FOREST_API}/trees/search?
      min_lat=${minLat}
      &min_lng=${minLng}
      &max_lat=${maxLat}
      &max_lng=${maxLng}`

    setTrees({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: event.target.getCenter().toArray() },
        },
      ],
    })
  }

  const handleMoveEnd = (event: ViewStateChangeEvent | MapboxEvent) => {
    const mapBounds = event.target.getBounds()
    setBounds(mapBounds)
    updateTrees(event)
  }

  return (
    <ReactMapGl
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
      initialViewState={INITIAL_VIEW_STATE} // wed, start here, load state from url if present, otherwise all of canada? (not all of canada....)
      style={{ width: '100%', height: theme.layout.mapHeight }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onLoad={updateTrees}
      onMoveEnd={handleMoveEnd}
    >
      <Source id="my-data" type="geojson" data={trees}>
        <Layer {...layerStyle} />
      </Source>
    </ReactMapGl>
  )
}
