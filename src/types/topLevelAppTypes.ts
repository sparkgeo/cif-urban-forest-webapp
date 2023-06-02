import { FeatureCollection } from 'geojson'

export interface SharableUrlParameters extends URLSearchParams {
  min_lat?: string
  min_lng?: string
  max_lat?: string
  max_lng?: string
  common_species?: string[]
  cities?: string[]
  max_dbh?: string
  min_dbh?: string
}

export interface TreeProperties {
  'Botanical Name Genus': string
  'Botanical Name Species': string
  'Common Genus': string
  'Common Species': string
  'Cultivar Name': string
  'DBH (DHP) (CM)': number
  Address: string
  City: string
  Id: string
  Neighbourhood: string
}
export interface TreeApiFeatureCollection extends FeatureCollection {
  limit?: number
  count?: number
}
export type SetSearchParametersAndUpdateTrees = (newParameters: SharableUrlParameters) => void
