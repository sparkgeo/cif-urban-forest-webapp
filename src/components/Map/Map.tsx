import ReactMapGl, {
  Layer,
  LngLatBoundsLike,
  MapLayerMouseEvent,
  MapboxEvent,
  MapboxGeoJSONFeature,
  MapboxMap,
  NavigationControl,
  Popup,
  Source,
  ViewStateChangeEvent,
} from 'react-map-gl'

import maplibregl, { LngLatBounds } from 'maplibre-gl'

import { useState } from 'react'
import { basemapStyle } from './basemapStyle'
import { CITY_CLICK_ZOOM_TO_LEVEL, INITIAL_VIEW_STATE } from '../../constants'
import {
  SetSearchParametersAndUpdateTrees,
  SharableUrlParameters,
  ApiFeatureCollection,
  TreeProperties,
} from '../../types/topLevelAppTypes'
import {
  cityCountLayer,
  cityLayer,
  clusteredTreeLayer,
  treeCountLayer,
  unclusteredTreeLayer,
} from './mapLayers'
import { TreeMetadata } from './TreeMetadata'
import { themeMui } from '../../globalStyles/themeMui'

export interface CifMapProps {
  cities: ApiFeatureCollection
  setSearchParametersAndUpdateTrees: SetSearchParametersAndUpdateTrees
  trees: ApiFeatureCollection
  updateTrees: () => void
}

interface PopupInfo {
  lngLat: GeoJSON.Position
  content: JSX.Element
}

export function Map({
  cities,
  setSearchParametersAndUpdateTrees,
  trees,
  updateTrees,
}: CifMapProps) {
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null)
  const closePopup = () => {
    setPopupInfo(null)
  }

  const updateUrlExtentParameters = (event: MapboxEvent | ViewStateChangeEvent) => {
    const map = event.target
    const currentZoom = map.getZoom()
    const mapBounds = map.getBounds()

    const min_lat = mapBounds.getSouth().toFixed(4)
    const min_lng = mapBounds.getWest().toFixed(4)
    const max_lat = mapBounds.getNorth().toFixed(4)
    const max_lng = mapBounds.getEast().toFixed(4)
    setSearchParametersAndUpdateTrees({
      min_lat,
      min_lng,
      max_lat,
      max_lng,
      zoom: currentZoom.toString(),
    } as SharableUrlParameters)
  }

  const updateInitialMapExtentIfExtentParametersExistInUrl = (event: MapboxEvent) => {
    const existingUrlParameters = Object.fromEntries(
      new URLSearchParams(window.location.search).entries(),
    )
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
    const map: MapboxMap = event.target
    updateInitialMapExtentIfExtentParametersExistInUrl(event)
    updateTrees()

    map.on('moveend', handleMoveEnd)
    map.on('click', 'tree-clusters', (mouseEvent: MapLayerMouseEvent) => {
      const features: MapboxGeoJSONFeature[] = map.queryRenderedFeatures(mouseEvent.point, {
        layers: ['tree-clusters'],
      })
      const clusterId = features[0]?.properties?.cluster_id
      map
        .getSource('trees')
        // @ts-ignore
        .getClusterExpansionZoom(clusterId, (error: any, zoom: number | undefined) => {
          if (error) return

          map.easeTo({
            // @ts-ignore
            center: features[0].geometry.coordinates,
            zoom,
            duration: 1000,
          })
        })
    })

    map.on('click', 'cities', (mouseEvent: MapLayerMouseEvent) => {
      const cityGeometry = mouseEvent.features?.[0].geometry as GeoJSON.Point
      const cityCentroid = cityGeometry.coordinates

      // @ts-ignore
      map.easeTo({ center: cityCentroid, zoom: CITY_CLICK_ZOOM_TO_LEVEL, duration: 1000 })
    })
    map.on('mouseenter', 'tree-clusters', () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseenter', 'unclustered-trees', () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseenter', 'cities', () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'tree-clusters', () => {
      map.getCanvas().style.cursor = ''
    })
    map.on('mouseleave', 'unclustered-trees', () => {
      map.getCanvas().style.cursor = ''
    })
    map.on('mouseleave', 'cities', () => {
      map.getCanvas().style.cursor = ''
    })
    map.on('click', 'unclustered-trees', (unclusteredTreeClickEvent: MapLayerMouseEvent) => {
      const treesAssociatedWithClick = unclusteredTreeClickEvent.features || []
      const isThereATreeAssociatedWithClick = treesAssociatedWithClick.length > 0

      if (isThereATreeAssociatedWithClick) {
        const treeAssociatedWithClick = treesAssociatedWithClick[0]
        const treeGeometry = treeAssociatedWithClick?.geometry as GeoJSON.Point

        setPopupInfo({
          lngLat: treeGeometry.coordinates,
          content: (
            <TreeMetadata treeProperties={treeAssociatedWithClick.properties as TreeProperties} />
          ),
        })
      }
    })
  }
  return (
    <ReactMapGl
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
      initialViewState={INITIAL_VIEW_STATE}
      style={{ width: '100%', height: '100vh' }}
      mapLib={maplibregl}
      mapStyle={basemapStyle}
      onLoad={handleOnLoad}
      interactiveLayerIds={[unclusteredTreeLayer.id!]}
    >
      <NavigationControl showCompass={false} style={{ margin: themeMui.spacing(4) }} />
      <Source id="trees" type="geojson" data={trees} cluster clusterMaxZoom={14} clusterRadius={50}>
        <Layer {...clusteredTreeLayer} />
        <Layer {...treeCountLayer} />
        <Layer {...unclusteredTreeLayer} />
      </Source>
      <Source id="cities" type="geojson" data={cities}>
        <Layer {...cityLayer} />
        <Layer {...cityCountLayer} />
      </Source>
      {popupInfo ? (
        <Popup
          longitude={popupInfo.lngLat[0]}
          latitude={popupInfo.lngLat[1]}
          onClose={closePopup}
          style={{ maxWidth: 'none', padding: 0 }}
        >
          {popupInfo.content}
        </Popup>
      ) : null}
    </ReactMapGl>
  )
}
