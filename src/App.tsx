import { ThemeProvider } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

import { Layout } from './components/Layout'
import { Sidebar } from './components/SidebarLeft'
import { themeMui } from './globalStyles/themeMui'
import { SharableUrlParameters, TreeApiFeatureCollection } from './types/topLevelAppTypes'
import { Map } from './components/Map/Map'
import { getSearchParameterStringFromSharableUrlParametersObject } from './library/getSearchParameterStringFromSharableUrlParametersObject'

export function App() {
  const [trees, setTrees] = useState<TreeApiFeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })
  const [searchParameters, setSearchParameters] = useSearchParams()

  const getApiTreeSearchUrl = (filterParameters: SharableUrlParameters | void): string => {
    if (filterParameters) {
      const searchParametersStringFromFunctionParameters =
        getSearchParameterStringFromSharableUrlParametersObject(filterParameters)

      return `${
        import.meta.env.VITE_CIF_URBAN_FOREST_API
      }/trees/search? ${searchParametersStringFromFunctionParameters}` // the space there is important! remove it and no results??
    }

    const apiUrlWithParametersFromAppUrl = `${
      import.meta.env.VITE_CIF_URBAN_FOREST_API
    }/trees/search? ${searchParameters.toString()}` // the space there is important! remove it and no results??

    return apiUrlWithParametersFromAppUrl
  }

  const updateTrees = (filterParameters: SharableUrlParameters | void) => {
    const treeApiUrl = getApiTreeSearchUrl(filterParameters)

    axios
      .get(treeApiUrl)
      .then(({ data: apiTreeData }) => {
        setTrees(apiTreeData)
      })
      .catch(() => alert('we will handle errors later. This is a placeholder'))
  }

  const setSearchParametersAndUpdateTrees = (newParameters: SharableUrlParameters) => {
    const existingUrlParameters = Object.fromEntries(searchParameters.entries())
    const updatedUrlParameters = {
      ...existingUrlParameters,
      ...newParameters,
    } as SharableUrlParameters

    setSearchParameters(updatedUrlParameters)
    // we cant rely on the the parameters being set before we update the trees,
    // so we add the filterParameters parameter with the most updated
    // parameters and avoid pulling query parameters from the url
    updateTrees(updatedUrlParameters)
  }

  const sideBar = (
    <Sidebar
      trees={trees}
      searchParameters={searchParameters}
      setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
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
