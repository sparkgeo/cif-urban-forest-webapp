import { CircularProgress, Snackbar, ThemeProvider } from '@mui/material'
import { debounce } from 'lodash'
import { FeatureCollection } from 'geojson'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import styled from '@emotion/styled'

import { Layout } from './components/Layout'
import { SidebarLeft } from './components/SidebarLeft'
import { themeMui } from './globalStyles/themeMui'
import { SharableUrlParameters, ApiFeatureCollection } from './types/topLevelAppTypes'
import { Map } from './components/Map/Map'
import { CommonSpecies, Municipalities, Provinces } from './types/locationsFilterTypes'
import { RowAlignItemsCenter } from './components/containers'
import { MIN_TREE_ZOOM } from './constants'

const LoaderPaddingLeft = styled(CircularProgress)`
  margin-left: ${themeMui.spacing(2)};
`
const CustomSnackbar = styled(Snackbar)`
  & .MuiSnackbarContent-root {
    min-width: fit-content;
  }
`

export function App() {
  const [cities, setCities] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })
  const [trees, setTrees] = useState<ApiFeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })
  const [, setSearchParameters] = useSearchParams()
  const [areLocationOptionsLoading, setAreLocationOptionsLoading] = useState(true)
  const [commmonSpecies, setCommonSpecies] = useState<CommonSpecies>([])
  const [errorText, setErrorText] = useState<string[]>([])
  const [isTreeDataLoading, setIsTreeDataLoading] = useState(false)
  const [municipalities, setMunicipalities] = useState<Municipalities>({})
  const [provinces, setProvinces] = useState<Provinces>([])
  const [treeCount, setTreeCount] = useState<undefined | number>()
  const isDataInitializing = areLocationOptionsLoading
  const clearErrorText = (errorTextToRemove: string) => {
    setErrorText((currentErrorText) => {
      return currentErrorText.filter((error) => error !== errorTextToRemove)
    })
  }

  useEffect(function loadLocationsOptions() {
    const locationsOptionsUrl = `${
      import.meta.env.VITE_CIF_URBAN_FOREST_API
    }/data/overview?common_species=True&provinces=True`

    axios
      .get(locationsOptionsUrl)
      .then(({ data }) => {
        setAreLocationOptionsLoading(false)
        const { provinces: municipalitiesByProvince, common_species } = data
        setProvinces(Object.keys(municipalitiesByProvince))
        setMunicipalities(municipalitiesByProvince)
        setCommonSpecies(common_species)
      })
      .catch(() => {
        setAreLocationOptionsLoading(false)
        setErrorText((currentErrorText) => [
          ...currentErrorText,
          'Unable to initialize filter options for locations or species. Please try refreshing the webpage',
        ])
      })
  }, [])

  const updateTrees = () => {
    setIsTreeDataLoading(true)
    // we cant trust react router dom's searchParams state, so we grab query parms from window
    const treeSearchParamsForApi = new URLSearchParams(window.location.search)
    const mapZoomLevel = Number(treeSearchParamsForApi.get('zoom'))
    const shouldShowTrees = mapZoomLevel > MIN_TREE_ZOOM

    if (shouldShowTrees) {
      treeSearchParamsForApi.append('count', 'true')
      treeSearchParamsForApi.delete('zoom')
    }

    const treeApiUrl = shouldShowTrees
      ? `${
          import.meta.env.VITE_CIF_URBAN_FOREST_API
        }/trees/search?${treeSearchParamsForApi.toString()}`
      : `${
          import.meta.env.VITE_CIF_URBAN_FOREST_API
        }/trees/city_counts?${treeSearchParamsForApi.toString()}`

    axios
      .get(treeApiUrl)
      .then(({ data }) => {
        setIsTreeDataLoading(false)
        setTreeCount(data.count)
        if (shouldShowTrees) {
          setTrees(data)
        }
        if (!shouldShowTrees) {
          setCities(data)
        }
      })
      .catch(() => {
        setIsTreeDataLoading(false)
        setErrorText((currentErrorText) => [
          ...currentErrorText,
          'Unable to query trees. Please try again.',
        ])
      })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateTrees = useCallback(debounce(updateTrees, 750), [])

  const clearSearchParameterTypeAndUpdateTrees = (paramName: string) => {
    // we cant trust react router's searchParams state,
    // so we grab url params from window
    const newSearchParameters = new URLSearchParams(window.location.search)
    newSearchParameters.delete(paramName)
    // react router's setSearchParams still works and is used
    // because it doesnt cacuse the app to refresh like writing
    //  to window.location.search would
    setSearchParameters(newSearchParameters)
    debouncedUpdateTrees()
  }

  const clearAllSearchParametersAndUpdateTrees = () => {
    // we cant trust react router's searchParams state,
    // so we grab url params from window
    const newSearchParameters = new URLSearchParams(window.location.search)
    newSearchParameters.delete('cities')
    newSearchParameters.delete('common_species')
    newSearchParameters.delete('min_dbh')
    newSearchParameters.delete('max_dbh')
    // react router's setSearchParams still works and is used
    // because it doesnt cacuse the app to refresh like writing
    //  to window.location.search would
    setSearchParameters(newSearchParameters)
    debouncedUpdateTrees()
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
      cities: newParameters.cities?.length
        ? newParameters.cities
        : existingSearchParameters.getAll('cities'),
      common_species: newParameters.common_species?.length
        ? newParameters.common_species
        : existingSearchParameters.getAll('common_species'),
      min_dbh: newParameters.min_dbh || existingSearchParameters.getAll('min_dbh'),
      max_dbh: newParameters.max_dbh || existingSearchParameters.getAll('max_dbh'),
      zoom: newParameters.zoom || existingSearchParameters.get('zoom'),
    } as SharableUrlParameters
    // react router's setSearchParams still works and is used because
    // it doesnt cacuse the app to refresh like writing
    // to window.location.search would
    setSearchParameters(updatedUrlParameters, { replace: true })

    debouncedUpdateTrees()
  }

  const sideBar = (
    <SidebarLeft
      clearSearchParameterTypeAndUpdateTrees={clearSearchParameterTypeAndUpdateTrees}
      commonSpecies={commmonSpecies}
      isDataInitializing={isDataInitializing}
      municipalities={municipalities}
      provinces={provinces}
      setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
      treeCount={treeCount}
      clearAllSearchParametersAndUpdateTrees={clearAllSearchParametersAndUpdateTrees}
    />
  )
  const map = (
    <Map
      updateTrees={updateTrees}
      setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
      trees={trees}
      cities={cities}
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
          horizontal: 'center',
        }}
      />
      <Layout sideBar={sideBar} map={map} errorText={errorText} clearErrorText={clearErrorText} />
    </ThemeProvider>
  )
}
