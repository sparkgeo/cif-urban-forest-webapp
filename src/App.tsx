import { ThemeProvider } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

import { Layout } from './components/Layout'
import { Sidebar } from './components/SidebarLeft'
import { themeMui } from './globalStyles/themeMui'
import { SharableUrlParameters, TreeApiFeatureCollection } from './types/topLevelAppTypes'
import { Map } from './components/Map/Map'
import { Municipalities } from './types/locationsFilterTypes'

export function App() {
  const [trees, setTrees] = useState<TreeApiFeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })
  const [searchParameters, setSearchParameters] = useSearchParams()
  const [provinces, setProvinces] = useState<string[]>([])
  const [municipalities, setMunicipalities] = useState<Municipalities>({})
  const [areLocationOptionsLoading, setAreLocationOptionsLoading] = useState(true)
  const isDataInitializing = areLocationOptionsLoading

  useEffect(function loadLocationsOptions() {
    const locationsOptionsUrl = `${
      import.meta.env.VITE_CIF_URBAN_FOREST_API
    }/data/overview?provinces=True`

    axios
      .get(locationsOptionsUrl)
      .then(({ data }) => {
        setAreLocationOptionsLoading(false)
        const { provinces: municipalitiesByProvince } = data
        setProvinces(Object.keys(municipalitiesByProvince))
        setMunicipalities(municipalitiesByProvince)
      })
      .catch((error) => {
        setAreLocationOptionsLoading(false)
        alert(error)
      })
  }, [])

  const updateTrees = useCallback(() => {
    const treeApiUrl = `${
      import.meta.env.VITE_CIF_URBAN_FOREST_API
    }/trees/search?${searchParameters.toString()}`

    axios
      .get(treeApiUrl)
      .then(({ data: apiTreeData }) => {
        setTrees(apiTreeData)
      })
      .catch(() => alert('we will handle errors later. This is a placeholder'))
  }, [searchParameters])

  const setSearchParametersAndUpdateTrees = useCallback(
    (newParameters: SharableUrlParameters) => {
      const existingUrlParameters = Object.fromEntries(searchParameters.entries())
      const updatedUrlParameters = {
        ...existingUrlParameters,
        ...newParameters,
      } as SharableUrlParameters

      setSearchParameters(updatedUrlParameters)

      updateTrees()
    },
    [searchParameters, setSearchParameters, updateTrees],
  )

  const sideBar = (
    <Sidebar
      trees={trees}
      searchParameters={searchParameters}
      setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
      provinces={provinces}
      municipalities={municipalities}
      isDataInitializing={isDataInitializing}
    />
  )
  const map = (
    <Map
      updateTrees={updateTrees}
      searchParameters={searchParameters}
      setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
      trees={trees}
    />
  )

  return (
    <ThemeProvider theme={themeMui}>
      <Layout sideBar={sideBar} map={map} />
    </ThemeProvider>
  )
}
