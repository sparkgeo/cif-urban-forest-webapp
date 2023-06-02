import { CircularProgress, Snackbar, ThemeProvider } from '@mui/material'
import { debounce } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import styled from '@emotion/styled'

import { Layout } from './components/Layout'
import { Sidebar } from './components/SidebarLeft'
import { themeMui } from './globalStyles/themeMui'
import { SharableUrlParameters, TreeApiFeatureCollection } from './types/topLevelAppTypes'
import { Map } from './components/Map/Map'
import { CommonSpecies, Municipalities, Provinces } from './types/locationsFilterTypes'
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
  const [provinces, setProvinces] = useState<Provinces>([])
  const [commmonSpecies, setCommonSpecies] = useState<CommonSpecies>([])
  const [, setSearchParameters] = useSearchParams()
  const isDataInitializing = areLocationOptionsLoading
  const [errorText, setErrorText] = useState<string[]>([])
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
    const treeSearchParams = new URLSearchParams(window.location.search)
    treeSearchParams.append('count', 'true')
    const treeApiUrl = `${
      import.meta.env.VITE_CIF_URBAN_FOREST_API
    }/trees/search?${treeSearchParams.toString()}`

    axios
      .get(treeApiUrl)
      .then(({ data: apiTreeData }) => {
        setIsTreeDataLoading(false)
        setTrees(apiTreeData)
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
    } as SharableUrlParameters
    // react router's setSearchParams still works and is used because
    // it doesnt cacuse the app to refresh like writing
    // to window.location.search would
    setSearchParameters(updatedUrlParameters, { replace: true })

    debouncedUpdateTrees()
  }

  const sideBar = (
    <Sidebar
      clearSearchParameterTypeAndUpdateTrees={clearSearchParameterTypeAndUpdateTrees}
      commonSpecies={commmonSpecies}
      isDataInitializing={isDataInitializing}
      municipalities={municipalities}
      provinces={provinces}
      setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
      trees={trees}
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
      <Layout sideBar={sideBar} map={map} errorText={errorText} clearErrorText={clearErrorText} />
    </ThemeProvider>
  )
}
