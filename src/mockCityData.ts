import { ApiFeatureCollection } from './types/topLevelAppTypes'

export const mockCityCountData: ApiFeatureCollection = {
  type: 'FeatureCollection',
  count: 999999999999999,
  limit: 100,
  features: [
    {
      type: 'Feature',
      properties: {
        city: 'Ajax',
        count: 51654,
      },
      geometry: { type: 'Point', coordinates: [-79.02, 43.85] },
    },
    {
      type: 'Feature',
      properties: {
        city: 'Brampton',
        count: 1185,
      },
      geometry: { type: 'Point', coordinates: [-79.76, 43.73] },
    },
    {
      type: 'Feature',
      properties: {
        city: 'Mississauga',
        count: 4824,
      },
      geometry: { type: 'Point', coordinates: [-79.64, 43.59] },
    },
    {
      type: 'Feature',
      properties: {
        city: 'Peterborough',
        count: 29455,
      },
      geometry: { type: 'Point', coordinates: [-78.32, 44.3] },
    },
    {
      type: 'Feature',
      properties: {
        city: 'Toronto',
        count: 23723,
      },
      geometry: { type: 'Point', coordinates: [-79.42, 43.7] },
    },
    {
      type: 'Feature',
      properties: {
        city: 'Vaughan',
        count: 2705,
      },
      geometry: { type: 'Point', coordinates: [-79.51, 43.84] },
    },
    {
      type: 'Feature',
      properties: {
        city: 'Whitby',
        count: 1414,
      },
      geometry: { type: 'Point', coordinates: [-78.94, 43.89] },
    },
  ],
}
