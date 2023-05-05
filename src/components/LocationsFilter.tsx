import { Checkbox, Collapse } from '@mui/material'
import { ChangeEvent, Dispatch, useEffect, useReducer, useState } from 'react'
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
import { SharableUrlParameters } from '../types/topLevelAppTypes'

const intialLocationsState: LocationsState = {}
interface LocationsFilterProps {
  municipalities: Municipalities
  provinces: Provinces
  searchParameters: SharableUrlParameters
  setSearchParametersAndUpdateTrees: (urlParamaters: SharableUrlParameters) => void
}

export function LocationsFilter({
  municipalities,
  provinces,
  searchParameters,
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

  useEffect(
    function updateLocationFilterSearchParametersOnChange() {
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
      const setMunicipalitiesUrlParameters = () => {
        const locationscheckedStateEntries: [string, LocationsStateProvinceValues][] =
          Object.entries(locationsCheckedState)
        const allMunicipalitiesNamesChecked = locationscheckedStateEntries
          .map(([province, value]) => {
            return getCheckedMunicipalityNames(province, value as LocationsStateProvinceValues)
          })
          .flat()

        const areLocationsSelected = !!allMunicipalitiesNamesChecked.length

        if (!areLocationsSelected) {
          searchParameters.delete('city')
          const existingUrlParametersWithCityDeleted = Object.fromEntries(
            searchParameters.entries(),
          )
          setSearchParametersAndUpdateTrees({
            ...existingUrlParametersWithCityDeleted,
          } as unknown as SharableUrlParameters)

          return
        }

        const existingUrlParameters = Object.fromEntries(searchParameters.entries())
        setSearchParametersAndUpdateTrees({
          ...existingUrlParameters,
          city: allMunicipalitiesNamesChecked,
        } as SharableUrlParameters)
      }

      setMunicipalitiesUrlParameters()
    },
    [locationsCheckedState, municipalities, searchParameters, setSearchParametersAndUpdateTrees],
  )

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
