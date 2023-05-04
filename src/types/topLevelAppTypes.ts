import { FeatureCollection } from 'geojson'

export interface SharableUrlParameters extends URLSearchParams {
  min_lat?: string
  min_lng?: string
  max_lat?: string
  max_lng?: string
  common_genus?: string | string[]
}

export interface TreeApiFeatureCollection extends FeatureCollection {
  limit?: number
  count?: number
}
