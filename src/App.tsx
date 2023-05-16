import { CircularProgress, Snackbar, ThemeProvider } from '@mui/material'
import { useEffect, useState } from 'react'
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
  const [areLocationOptionsLoading, setAreLocationOptionsLoading] = useState(true)
  const [isTreeDataLoading, setIsTreeDataLoading] = useState(false)
  const [municipalities, setMunicipalities] = useState<Municipalities>({})
  const [provinces, setProvinces] = useState<string[]>([])
  const [, setSearchParameters] = useSearchParams()
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

  const updateTrees = () => {
    setIsTreeDataLoading(true)
    // we cant trust react router dom's searchParams state, so we grab query parms from window
    const treeApiUrl = `${import.meta.env.VITE_CIF_URBAN_FOREST_API}/trees/search?${
      window.location.search
    }`

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
  }

  const clearSearchParameterTypeAndUpdateTrees = (paramName: string) => {
    // we cant trust react router's searchParams state,
    // so we grab url params from window
    const newSearchParameters = new URLSearchParams(window.location.search)
    newSearchParameters.delete(paramName)
    // react router's setSearchParams still works and is used
    // because it doesnt cacuse the app to refresh like writing
    //  to window.location.search would
    setSearchParameters(newSearchParameters)
    updateTrees()
  }

  const setSearchParametersAndUpdateTrees = (newParameters: SharableUrlParameters) => {
    // we cant trust react router's searchParams state,
    // so we grab url params from window
    const existingSearchParameters = new URLSearchParams(window.location.search)

    const minLatToUse = newParameters.min_lat || existingSearchParameters.get('min_lat')
    const minLngToUse = newParameters.min_lng || existingSearchParameters.get('min_lng')
    const maxLatToUse = newParameters.max_lat || existingSearchParameters.get('max_lat')
    const maxLngToUse = newParameters.max_lng || existingSearchParameters.get('max_lng')
    const areAnyExtentValuesMissing = !minLatToUse || !minLngToUse || !maxLatToUse || !maxLngToUse
    const extentParameters = areAnyExtentValuesMissing
      ? null
      : {
          min_lat: minLatToUse,
          min_lng: minLngToUse,
          max_lat: maxLatToUse,
          max_lng: maxLngToUse,
        }

    const updatedUrlParameters = {
      ...extentParameters,
      city: newParameters.city?.length
        ? newParameters.city
        : existingSearchParameters.getAll('city'),
      common_genus: newParameters.common_genus?.length
        ? newParameters.common_genus
        : existingSearchParameters.getAll('common_genus'),
    } as SharableUrlParameters
    // react router's setSearchParams still works and is used because
    // it doesnt cacuse the app to refresh like writing
    // to window.location.search would
    setSearchParameters(updatedUrlParameters, { replace: true })

    updateTrees()
  }

  const sideBar = (
    <Sidebar
      trees={trees}
      setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
      provinces={provinces}
      municipalities={municipalities}
      isDataInitializing={isDataInitializing}
      clearSearchParameterTypeAndUpdateTrees={clearSearchParameterTypeAndUpdateTrees}
    />
  )
  const map = (
    <Map
      updateTrees={updateTrees}
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
