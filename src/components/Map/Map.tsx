import ReactMapGl, {
  Layer,
  LngLatBoundsLike,
  MapboxEvent,
  Source,
  ViewStateChangeEvent,
} from 'react-map-gl'
import maplibregl, { LngLatBounds } from 'maplibre-gl'

import { basemapStyle } from './basemapStyle'
import { INITIAL_VIEW_STATE } from '../../constants'
import { SharableUrlParameters, TreeApiFeatureCollection } from '../../types/topLevelAppTypes'
import { clusteredTreeLayer, treeCountLayer, unclusteredTreeLayer } from './mapLayers'

export interface CifMapProps {
  searchParameters: SharableUrlParameters
  setSearchParametersAndUpdateTrees: (urlParamaters: SharableUrlParameters) => void
  trees: TreeApiFeatureCollection
  updateTrees: () => void
}

export function Map({
  searchParameters,
  setSearchParametersAndUpdateTrees,
  trees,
  updateTrees,
}: CifMapProps) {
  const updateUrlExtentParameters = (event: MapboxEvent | ViewStateChangeEvent) => {
    const mapBounds = event.target.getBounds()

    const min_lat = mapBounds.getSouth().toFixed(4)
    const min_lng = mapBounds.getWest().toFixed(4)
    const max_lat = mapBounds.getNorth().toFixed(4)
    const max_lng = mapBounds.getEast().toFixed(4)
    setSearchParametersAndUpdateTrees({
      min_lat,
      min_lng,
      max_lat,
      max_lng,
    } as SharableUrlParameters)
  }

  const updateInitialMapExtentIfExtentParametersExistInUrl = (event: MapboxEvent) => {
    const existingUrlParameters = Object.fromEntries(searchParameters.entries())
    const { min_lat: south, min_lng: west, max_lat: north, max_lng: east } = existingUrlParameters

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

  const handleMoveEnd = (event: ViewStateChangeEvent) => {
    updateUrlExtentParameters(event)
  }
  const handleOnLoad = (event: MapboxEvent) => {
    updateInitialMapExtentIfExtentParametersExistInUrl(event)
    updateTrees()

    event.target.on('moveend', handleMoveEnd)
  }
  return (
    <ReactMapGl
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
      initialViewState={INITIAL_VIEW_STATE}
      style={{ width: '100%', height: '100vh' }}
      mapLib={maplibregl}
      mapStyle={basemapStyle}
      onLoad={handleOnLoad}
    >
      <Source id="trees" type="geojson" data={trees} cluster clusterMaxZoom={14} clusterRadius={50}>
        <Layer {...clusteredTreeLayer} />
        <Layer {...treeCountLayer} />
        <Layer {...unclusteredTreeLayer} />
      </Source>
    </ReactMapGl>
  )
}
