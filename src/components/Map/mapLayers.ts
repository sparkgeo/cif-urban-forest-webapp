import type { LayerProps } from 'react-map-gl'
import { theme } from '../../globalStyles/theme'
import { MAX_CITIES_ZOOM, MIN_TREE_ZOOM } from '../../constants'

export const clusteredTreeLayer: LayerProps = {
  id: 'tree-clusters',
  type: 'circle',
  source: 'trees',
  filter: ['has', 'point_count'],
  minzoom: MIN_TREE_ZOOM,
  paint: {
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
    'circle-stroke-width': 4,
    'circle-color': [
      'step',
      ['get', 'point_count'],
      theme.color.treeDensity.fill.low,
      50,
      theme.color.treeDensity.fill.medium,
      750,
      theme.color.treeDensity.fill.high,
    ],
    'circle-stroke-color': [
      'step',
      ['get', 'point_count'],
      theme.color.treeDensity.stroke.low,
      50,
      theme.color.treeDensity.stroke.medium,
      750,
      theme.color.treeDensity.stroke.high,
    ],
  },
}

export const cityLayer: LayerProps = {
  id: 'cities',
  type: 'circle',
  source: 'cities',
  maxzoom: MAX_CITIES_ZOOM,
  paint: {
    'circle-radius': ['step', ['get', 'count'], 20, 100, 30, 750, 40],
    'circle-stroke-width': 4,
    'circle-color': [
      'step',
      ['get', 'count'],
      theme.color.treeDensity.fill.low,
      50,
      theme.color.treeDensity.fill.medium,
      750,
      theme.color.treeDensity.fill.high,
    ],
    'circle-stroke-color': [
      'step',
      ['get', 'count'],
      theme.color.treeDensity.stroke.low,
      50,
      theme.color.treeDensity.stroke.medium,
      750,
      theme.color.treeDensity.stroke.high,
    ],
  },
}

export const treeCountLayer: LayerProps = {
  id: 'cluster-tree-count',
  type: 'symbol',
  source: 'trees',
  filter: ['has', 'point_count'],
  minzoom: MIN_TREE_ZOOM,
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Noto Sans Bold'],
    'text-size': 12,
  },
}

export const cityCountLayer: LayerProps = {
  id: 'city-count',
  type: 'symbol',
  source: 'cities',
  maxzoom: MAX_CITIES_ZOOM,
  layout: {
    'text-field': '{count}',
    'text-font': ['Noto Sans Bold'],
    'text-size': 12,
  },
}

export const unclusteredTreeLayer: LayerProps = {
  id: 'unclustered-trees',
  type: 'circle',
  source: 'trees',
  minzoom: MIN_TREE_ZOOM,
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': theme.color.charcoal,
    'circle-radius': 7,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  },
}
