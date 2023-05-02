import { MapboxEvent } from 'mapbox-gl'
import { ThemeProvider } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { ViewStateChangeEvent } from 'react-map-gl'
import axios from 'axios'

import { Layout } from './components/Layout'
import { Sidebar } from './components/SidebarLeft'
import { themeMui } from './globalStyles/themeMui'
import { TreeApiFeatureCollection } from './types/topLevelAppTypes'
import { Map } from './components/Map/Map'
import { mockTreesResponse } from './mockTreesData'

export function App() {
  const [trees, setTrees] = useState<TreeApiFeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })
  const [searchParameters, setSearchParameters] = useSearchParams()

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
      .then(() => {
        setTrees(mockTreesResponse)
      })
      .catch(() => alert('we will handle errors later. This is a placeholder'))
  }
  const sideBar = <Sidebar trees={trees} />
  const map = (
    <Map
      updateTrees={updateTrees}
      searchParameters={searchParameters}
      setSearchParameters={setSearchParameters}
      trees={trees}
    />
  )

  return (
    <ThemeProvider theme={themeMui}>
      <Layout sideBar={sideBar} map={map} />
    </ThemeProvider>
  )
}
