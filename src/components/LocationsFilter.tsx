import { Checkbox, Collapse } from '@mui/material'
import { ChangeEvent, useReducer, useState } from 'react'
import { CifFormControlLabel, CifList } from './customMuiFormComponents'
import { locationsCheckedReducer } from './Map/locationsCheckedReducer'
import { ProvincesFilter } from './ProvincesFilter'
import {
  HandleMunicipalityCheckboxChangeProps,
  HandleProvinceCheckboxChangeProps,
  Locations,
  LocationsState,
  LocationsStateProvinceValues,
} from '../types/locationsFilterTypes'
import { ButtonExpandCollapse } from './ButtonExpandCollapse'
import { RowAlignItemsCenter } from './containers'

const locations: Locations = {
  provinces: ['British Columbia', 'Alberta', 'Ontario'],
  municipalities: {
    'British Columbia': ['Penticton', 'Princton', 'Kimberley', 'Vancouver', 'Youbou', 'Greenwood'],
    Alberta: ['Vulcan', 'Calgary', 'Longview', 'Coleman'],
  },
}

const { provinces, municipalities } = locations

const intialLocationsState: LocationsState = {}

export function LocationsFilter() {
  const [isLocationsFilterExpanded, setIsLocationsFilterExpanded] = useState(false)
  const [locationsCheckedState, locationsCheckedDispatch] = useReducer(
    locationsCheckedReducer,
    intialLocationsState,
  )
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

  const handleProvinceCheckboxChange = ({
    isChecked,
    province,
  }: HandleProvinceCheckboxChangeProps) => {
    locationsCheckedDispatch({
      type: 'toggleAllMunicipalitiesForProvince',
      payload: { municipalities, isChecked, province },
    })
  }

  const toggleIsLocationsFilterExpanded = () => {
    setIsLocationsFilterExpanded(!isLocationsFilterExpanded)
  }

  const handleLocationCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    locationsCheckedDispatch({
      type: 'toggleAllMunicipalities',
      payload: { isChecked, provinces, municipalities },
    })

    if (isChecked) {
      setIsLocationsFilterExpanded(true)
    }
  }

  const handleMunicipalityCheckboxChange = ({
    municipalityDisplayIndex,
    province,
    isMunicipalityChecked,
  }: HandleMunicipalityCheckboxChangeProps) => {
    locationsCheckedDispatch({
      type: 'toggleMunicipalityChecked',
      payload: { province, isMunicipalityChecked, municipalityDisplayIndex, municipalities },
    })
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
