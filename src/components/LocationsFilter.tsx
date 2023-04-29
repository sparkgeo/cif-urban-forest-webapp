import { Checkbox } from '@mui/material'
import { ChangeEvent, useReducer } from 'react'
import { CifFormControlLabel, CifList, CifListItem } from './customMuiFormComponents'
import { ColumnFullWidth } from './generic/containers'
import {
  LocationsState,
  LocationsStateProvinceValues,
  locationsCheckedReducer,
} from './Map/locationsCheckedReducer'

interface Locations {
  provinces: string[]
  municipalities: { [key: string]: string[] }
}
interface HandleProvinceCheckboxChangeProps {
  isChecked: boolean
  province: string
}

interface HandleMunicipalityCheckboxChangeProps {
  municipalityDisplayIndex: number
  province: string
  isMunicipalityChecked: boolean
}

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

  const handleLocationCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    locationsCheckedDispatch({
      type: 'toggleAllMunicipalities',
      payload: { isChecked, provinces, municipalities },
    })
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
        const isAnyProvincialMunicipalityChecked =
          !!locationsCheckedState[province]?.isAnyMunicipalityChecked
        const isProvinceIndeterminate = !!locationsCheckedState[province]?.isProvinceIndeterminate

        return (
          <CifListItem key={province}>
            <ColumnFullWidth>
              <CifFormControlLabel
                label={province}
                control={
                  <Checkbox
                    checked={isAnyProvincialMunicipalityChecked}
                    indeterminate={isProvinceIndeterminate}
                    onChange={(event) => {
                      handleProvinceCheckboxChange({ isChecked: event.target.checked, province })
                    }}
                  />
                }
              />

              <CifList>
                {municipalities[province]?.map((municipality, municipalityDisplayIndex) => {
                  const isMunicipalityChecked =
                    !!locationsCheckedState?.[province]?.municipalitiesChecked?.[
                      municipalityDisplayIndex
                    ]
                  return (
                    <CifListItem key={municipality}>
                      <CifFormControlLabel
                        label={municipality}
                        control={
                          <Checkbox
                            checked={isMunicipalityChecked}
                            onChange={(event) => {
                              handleMunicipalityCheckboxChange({
                                municipalityDisplayIndex,
                                province,
                                isMunicipalityChecked: event.target.checked,
                              })
                            }}
                          />
                        }
                      />
                    </CifListItem>
                  )
                })}
              </CifList>
            </ColumnFullWidth>
          </CifListItem>
        )
      })}
    </CifList>
  )
  return (
    <>
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
      {provinceCheckboxes}
    </>
  )
}
