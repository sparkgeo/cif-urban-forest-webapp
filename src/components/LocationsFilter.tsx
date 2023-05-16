import { ChangeEvent, Dispatch, useReducer, useState } from 'react'
import { Checkbox, Collapse } from '@mui/material'

import { CifFormControlLabel, CifList } from './customMuiFormComponents'
import { locationsCheckedReducer } from './Map/locationsCheckedReducer'
import { ProvincesFilter } from './ProvincesFilter'
import {
  HandleMunicipalityCheckboxChangeProps,
  HandleProvinceCheckboxChangeProps,
  LocationsAction,
  LocationsState,
  LocationsStateProvinceValues,
  Municipalities,
  Provinces,
} from '../types/locationsFilterTypes'
import { ButtonExpandCollapse } from './ButtonExpandCollapse'
import { RowAlignItemsCenter } from './containers'
import {
  SetSearchParametersAndUpdateTreesProps,
  SharableUrlParameters,
} from '../types/topLevelAppTypes'

const intialLocationsState: LocationsState = {}
interface LocationsFilterProps {
  clearSearchParameterTypeAndUpdateTrees: (paramName: string) => void
  municipalities: Municipalities
  provinces: Provinces
  setSearchParametersAndUpdateTrees: (props: SetSearchParametersAndUpdateTreesProps) => void
}

export function LocationsFilter({
  clearSearchParameterTypeAndUpdateTrees,
  municipalities,
  provinces,
  setSearchParametersAndUpdateTrees,
}: LocationsFilterProps) {
  const [isLocationsFilterExpanded, setIsLocationsFilterExpanded] = useState(false)
  const [locationsCheckedState, locationsCheckedDispatch]: [
    LocationsState,
    Dispatch<LocationsAction>,
  ] = useReducer(locationsCheckedReducer, intialLocationsState)

  const allMunicipalitiesFlattened = Object.values(municipalities).flat()
  const allMunicipalitiesCount = allMunicipalitiesFlattened.length
  const provincialCheckedStates: LocationsStateProvinceValues[] =
    Object.values(locationsCheckedState)
  const allCheckedMunicipalities = provincialCheckedStates
    .map((provincialState) => provincialState.municipalitiesChecked)
    .flat()
  const allCheckedMunicipalitiesCount = allCheckedMunicipalities.filter(
    (isChecked) => isChecked,
  ).length
  const isAnyMunicipalityChecked = allCheckedMunicipalitiesCount > 0
  const isLocationsIndeterminate =
    isAnyMunicipalityChecked && allCheckedMunicipalitiesCount < allMunicipalitiesCount

  const toggleIsLocationsFilterExpanded = () => {
    setIsLocationsFilterExpanded(!isLocationsFilterExpanded)
  }

  const updateLocationFilterSearchParametersOnChange = (
    updatedLocationsCheckedStateHack: LocationsState,
  ) => {
    const getCheckedMunicipalityNames = (
      province: string,
      locationsStateProvinceValues: LocationsStateProvinceValues,
    ) => {
      return locationsStateProvinceValues.municipalitiesChecked
        ?.map((isChecked: boolean, index: number) =>
          isChecked ? municipalities[province][index] : null,
        )
        .filter((municipalityName) => !!municipalityName)
    }

    const locationsCheckedStateHackEntries: [string, LocationsStateProvinceValues][] =
      Object.entries(updatedLocationsCheckedStateHack)
    const allMunicipalitiesNamesChecked = locationsCheckedStateHackEntries
      .map(([province, value]) => {
        return getCheckedMunicipalityNames(province, value as LocationsStateProvinceValues)
      })
      .flat()

    const areLocationsSelected = !!allMunicipalitiesNamesChecked.length

    if (!areLocationsSelected) {
      clearSearchParameterTypeAndUpdateTrees('city')

      return
    }

    setSearchParametersAndUpdateTrees({
      newParameters: {
        city: allMunicipalitiesNamesChecked,
      } as SharableUrlParameters,
    })
  }

  const handleProvinceCheckboxChange = ({
    isChecked,
    province,
  }: HandleProvinceCheckboxChangeProps) => {
    const actionForDispatch: LocationsAction = {
      type: 'toggleAllMunicipalitiesForProvince',
      payload: { municipalities, isChecked, province },
    }
    // Dispatching an action with react useReducer does not guarantee
    // sync state updates, so we call the reducer directly to see what
    // the new state will be... Not ideal. More info here: https://github.com/facebook/react/issues/15344#issuecomment-864236996
    const updatedLocationsCheckedStateHack = locationsCheckedReducer(
      locationsCheckedState,
      actionForDispatch,
    )
    locationsCheckedDispatch(actionForDispatch)
    updateLocationFilterSearchParametersOnChange(updatedLocationsCheckedStateHack)
  }

  const handleLocationCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    const actionForDispatch: LocationsAction = {
      type: 'toggleAllMunicipalities',
      payload: { isChecked, provinces, municipalities },
    }
    // Dispatching an action with react useReducer does not guarantee
    // sync state updates, so we call the reducer directly to see what
    // the new state will be... Not ideal. More info here: https://github.com/facebook/react/issues/15344#issuecomment-864236996
    const updatedLocationsCheckedStateHack = locationsCheckedReducer(
      locationsCheckedState,
      actionForDispatch,
    )
    locationsCheckedDispatch(actionForDispatch)
    updateLocationFilterSearchParametersOnChange(updatedLocationsCheckedStateHack)

    if (isChecked) {
      setIsLocationsFilterExpanded(true)
    }
  }

  const handleMunicipalityCheckboxChange = ({
    municipalityDisplayIndex,
    province,
    isMunicipalityChecked,
  }: HandleMunicipalityCheckboxChangeProps) => {
    const actionForDispatch: LocationsAction = {
      type: 'toggleMunicipalityChecked',
      payload: { province, isMunicipalityChecked, municipalityDisplayIndex, municipalities },
    }
    // Dispatching an action with react useReducer does not guarantee
    // sync state updates, so we call the reducer directly to see what
    // the new state will be... Not ideal. More info here: https://github.com/facebook/react/issues/15344#issuecomment-864236996
    const updatedLocationsCheckedStateHack = locationsCheckedReducer(
      locationsCheckedState,
      actionForDispatch,
    )
    locationsCheckedDispatch(actionForDispatch)
    updateLocationFilterSearchParametersOnChange(updatedLocationsCheckedStateHack)
  }

  const provinceCheckboxes = (
    <CifList>
      {provinces.map((province) => {
        return (
          <ProvincesFilter
            key={province}
            handleMunicipalityCheckboxChange={handleMunicipalityCheckboxChange}
            handleProvinceCheckboxChange={handleProvinceCheckboxChange}
            locationsCheckedState={locationsCheckedState}
            municipalities={municipalities}
            province={province}
          />
        )
      })}
    </CifList>
  )

  return (
    <>
      <RowAlignItemsCenter>
        <ButtonExpandCollapse
          onClick={toggleIsLocationsFilterExpanded}
          isExpanded={isLocationsFilterExpanded}
        />
        <CifFormControlLabel
          label="Locations"
          control={
            <Checkbox
              checked={isAnyMunicipalityChecked}
              indeterminate={isLocationsIndeterminate}
              onChange={handleLocationCheckboxChange}
            />
          }
        />
      </RowAlignItemsCenter>
      <Collapse in={isLocationsFilterExpanded}>{provinceCheckboxes}</Collapse>
    </>
  )
}
