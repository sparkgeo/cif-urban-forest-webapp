import { FeatureCollection } from 'geojson'
import { MapboxEvent } from 'mapbox-gl'
import { ViewStateChangeEvent } from 'react-map-gl'

export interface SharableUrlParameters extends URLSearchParams {
  east?: string
  south?: string
  west?: string
  north?: string
}
export interface CifMapProps {
  updateTrees: (event: MapboxEvent | ViewStateChangeEvent) => void
  searchParameters: SharableUrlParameters
  setSearchParameters: (urlParamaters: SharableUrlParameters) => void
  trees: TreeApiFeatureCollection
}
export interface TreeApiFeatureCollection extends FeatureCollection {
  limit?: number
  count?: number
}
