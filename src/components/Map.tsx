import ReactMapGl, {
  Layer,
  LngLatBoundsLike,
  MapboxEvent,
  Source,
  ViewStateChangeEvent,
} from 'react-map-gl'
import { FeatureCollection } from 'geojson'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import maplibregl, { LngLatBounds } from 'maplibre-gl'

import { basemapStyle } from '../styles/maplibre/basemapStyle'
import { INITIAL_VIEW_STATE } from '../constants'
import { theme } from '../styles/theme'
import { treeStyle } from '../styles/maplibre/treesStyle'

export function Map() {
  const [trees, setTrees] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
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

    axios
      .get(treeApiUrl)
      .then((response) => {
        console.log(response)
        // setTrees({
        //   type: 'FeatureCollection',
        //   features: [
        //     {
        //       type: 'Feature',
        //       properties: {},
        //       geometry: { type: 'Point', coordinates: event.target.getCenter().toArray() },
        //     },
        //   ],
        // })
      })
      .catch(() => alert('we will handle errors later. This is a placeholder'))
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

  const updateInitialMapExtentIfExtentParametersExistInUrl = (event: MapboxEvent) => {
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
    updateInitialMapExtentIfExtentParametersExistInUrl(event)
    updateTrees(event)
  }

  const handleMoveEnd = (event: ViewStateChangeEvent) => {
    updateUrlExtentParameters(event)
    updateTrees(event)
  }

  return (
    <ReactMapGl
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
      initialViewState={INITIAL_VIEW_STATE}
      style={{ width: '100%', height: theme.layout.mapHeight }}
      mapLib={maplibregl}
      mapStyle={basemapStyle}
      onLoad={handleOnLoad}
      onMoveEnd={handleMoveEnd}
    >
      <Source id="my-data" type="geojson" data={trees}>
        <Layer {...treeStyle} />
      </Source>
    </ReactMapGl>
  )
}
