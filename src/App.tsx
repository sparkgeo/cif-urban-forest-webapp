import { CircularProgress, Snackbar, ThemeProvider } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import styled from '@emotion/styled'

import { Layout } from './components/Layout'
import { Sidebar } from './components/SidebarLeft'
import { themeMui } from './globalStyles/themeMui'
import { SharableUrlParameters, TreeApiFeatureCollection } from './types/topLevelAppTypes'
import { Map } from './components/Map/Map'
import { Municipalities } from './types/locationsFilterTypes'
import { RowAlignItemsCenter } from './components/containers'

const LoaderPaddingLeft = styled(CircularProgress)`
  margin-left: ${themeMui.spacing(2)};
`
const CustomSnackbar = styled(Snackbar)`
  & .MuiSnackbarContent-root {
    min-width: fit-content;
  }
`

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
  const [isTreeDataLoading, setIsTreeDataLoading] = useState(false)

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
    setIsTreeDataLoading(true)
    const treeApiUrl = `${
      import.meta.env.VITE_CIF_URBAN_FOREST_API
    }/trees/search?${searchParameters.toString()}`

    axios
      .get(treeApiUrl)
      .then(({ data: apiTreeData }) => {
        setIsTreeDataLoading(false)
        setTrees(apiTreeData)
      })
      .catch(() => {
        setIsTreeDataLoading(false)
        alert('we will handle errors later. This is a placeholder')
      })
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
      <CustomSnackbar
        open={isTreeDataLoading}
        autoHideDuration={6000}
        message={
          <RowAlignItemsCenter>
            Data Loading <LoaderPaddingLeft />
          </RowAlignItemsCenter>
        }
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      />
      <Layout sideBar={sideBar} map={map} />
    </ThemeProvider>
  )
}
