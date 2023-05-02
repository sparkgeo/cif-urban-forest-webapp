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
import { theme } from '../../globalStyles/theme'
import { treeStyle } from './treesStyle'
import { CifMapProps, SharableUrlParameters } from '../../types/typesJunkDrawer'

export function Map({ updateTrees, searchParameters, setSearchParameters, trees }: CifMapProps) {
  const updateUrlExtentParameters = (event: MapboxEvent | ViewStateChangeEvent) => {
    const mapBounds = event.target.getBounds()
    const existingUrlParameters = Object.fromEntries(searchParameters.entries())

    const east = mapBounds.getEast().toFixed(4)
    const south = mapBounds.getSouth().toFixed(4)
    const west = mapBounds.getWest().toFixed(4)
    const north = mapBounds.getNorth().toFixed(4)
    setSearchParameters({
      ...existingUrlParameters,
      east,
      south,
      west,
      north,
    } as SharableUrlParameters)
  }

  const updateInitialMapExtentIfExtentParametersExistInUrl = (event: MapboxEvent) => {
    const existingUrlParameters = Object.fromEntries(searchParameters.entries())
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
