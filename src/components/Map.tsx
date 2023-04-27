import ReactMapGl, {
  CircleLayer,
  Layer,
  LngLatBoundsLike,
  MapboxEvent,
  MapboxStyle,
  Source,
  ViewStateChangeEvent,
} from 'react-map-gl'
import { useSearchParams } from 'react-router-dom'
import maplibregl, { LngLatBounds } from 'maplibre-gl'

import { FeatureCollection } from 'geojson'
import { useState } from 'react'

import { theme } from '../styles/theme'

export const basemap: MapboxStyle = {
  version: 8,
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

const INITIAL_VIEW_STATE = {
  longitude: -97,
  latitude: 63,
  zoom: 3,
}

const layerStyle: CircleLayer = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf',
  },
}

export function Map() {
  const [trees, setTrees] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [-122.4, 37.8] } },
    ],
  })
  const [searchParams, setSearchParams] = useSearchParams()

  const updateTrees = (event: MapboxEvent | ViewStateChangeEvent) => {
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

  const updateUrlExtentParameters = (event: MapboxEvent | ViewStateChangeEvent) => {
    const mapBounds = event.target.getBounds()
    const existingUrlParameters = Object.fromEntries(searchParams.entries())

    const east = mapBounds.getEast().toFixed(4)
    const south = mapBounds.getSouth().toFixed(4)
    const west = mapBounds.getWest().toFixed(4)
    const north = mapBounds.getNorth().toFixed(4)
    setSearchParams({ ...existingUrlParameters, east, south, west, north })
  }

  const updateMapExtentIfUrlExtentParameters = (event: MapboxEvent) => {
    const existingUrlParameters = Object.fromEntries(searchParams.entries())
    const { east, south, west, north } = existingUrlParameters

    if (east && south && west && north) {
      const newMapBounds = new LngLatBounds(
        [Number(west), Number(south)],
        [Number(east), Number(north)],
      )

      const mapInstance = event.target
      mapInstance.fitBounds(newMapBounds as unknown as LngLatBoundsLike, {
        duration: 0,
      })
    }
  }
  const handleOnLoad = (event: MapboxEvent) => {
    updateMapExtentIfUrlExtentParameters(event)
    updateTrees(event)
  }

  const handleMoveEnd = (event: ViewStateChangeEvent) => {
    updateUrlExtentParameters(event)
    updateTrees(event)
  }

  return (
    <ReactMapGl
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
      initialViewState={INITIAL_VIEW_STATE} // wed, start here, load state from url if present, otherwise all of canada? (not all of canada....)
      style={{ width: '100%', height: theme.layout.mapHeight }}
      mapLib={maplibregl}
      mapStyle={basemap}
      onLoad={handleOnLoad}
      onMoveEnd={handleMoveEnd} // here todo figure out types for reactmapgl. make it maplibre nor mapbox
    >
      <Source id="my-data" type="geojson" data={trees}>
        <Layer {...layerStyle} />
      </Source>
    </ReactMapGl>
  )
}
