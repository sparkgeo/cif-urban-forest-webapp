import { Checkbox, Collapse, styled } from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material'
import { ChangeEvent, useState } from 'react'

import {
  HandleMunicipalityCheckboxChangeProps,
  HandleProvinceCheckboxChangeProps,
  LocationsState,
  Municipalities,
} from '../types/locationsFilterTypes'
import { CifFormControlLabel, CifList, CifListItem } from './customMuiFormComponents'
import { ColumnFullWidth } from './generic/containers'

export const ProvinceRow = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  & button {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`

interface ProvincesFilterProps {
  handleMunicipalityCheckboxChange: (props: HandleMunicipalityCheckboxChangeProps) => void
  handleProvinceCheckboxChange: (props: HandleProvinceCheckboxChangeProps) => void
  locationsCheckedState: LocationsState
  municipalities: Municipalities
  province: string
}

export function ProvincesFilter({
  handleMunicipalityCheckboxChange,
  handleProvinceCheckboxChange,
  locationsCheckedState,
  municipalities,
  province,
}: ProvincesFilterProps) {
  const [areMunicipalitiyOptionsExpanded, setAreMunicipalityOptionsExpanded] = useState(false)
  const isAnyProvincialMunicipalityChecked =
    !!locationsCheckedState[province]?.isAnyMunicipalityChecked
  const isProvinceIndeterminate = !!locationsCheckedState[province]?.isProvinceIndeterminate

  const expandCollapseMunicipalities = () => {
    setAreMunicipalityOptionsExpanded(!areMunicipalitiyOptionsExpanded)
  }

  const handleProvinceCheckboxChangeOverride = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    if (isChecked) {
      setAreMunicipalityOptionsExpanded(true)
    }

    handleProvinceCheckboxChange({ isChecked: event.target.checked, province })
  }

  return (
    <CifListItem key={province}>
      <ColumnFullWidth>
        <ProvinceRow>
          <button type="button" onClick={expandCollapseMunicipalities}>
            {areMunicipalitiyOptionsExpanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
          </button>

          <CifFormControlLabel
            label={province}
            control={
              <Checkbox
                checked={isAnyProvincialMunicipalityChecked}
                indeterminate={isProvinceIndeterminate}
                onChange={handleProvinceCheckboxChangeOverride}
              />
            }
          />
        </ProvinceRow>

        <Collapse in={areMunicipalitiyOptionsExpanded} unmountOnExit>
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
        </Collapse>
      </ColumnFullWidth>
    </CifListItem>
  )
}
