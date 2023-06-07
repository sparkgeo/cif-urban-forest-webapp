import { Checkbox, Collapse } from '@mui/material'
import { ChangeEvent, useState } from 'react'

import {
  HandleMunicipalityCheckboxChangeProps,
  HandleProvinceCheckboxChangeProps,
  LocationsState,
  Municipalities,
} from '../types/locationsFilterTypes'
import { CifList, CifListItem, CifLabel, CifLabelIndented } from './customMuiFormComponents'
import { ColumnFullWidth, RowAlignItemsCenter } from './containers'
import { ButtonExpandCollapse } from './ButtonExpandCollapse'

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

  const alphabeticallySortedProvincialMunicipalities = municipalities[province]?.sort() ?? []

  return (
    <CifListItem key={province}>
      <ColumnFullWidth>
        <RowAlignItemsCenter>
          <ButtonExpandCollapse
            isExpanded={areMunicipalitiyOptionsExpanded}
            onClick={expandCollapseMunicipalities}
          />
          <CifLabel>{province}</CifLabel>
          <Checkbox
            checked={isAnyProvincialMunicipalityChecked}
            indeterminate={isProvinceIndeterminate}
            onChange={handleProvinceCheckboxChangeOverride}
          />
        </RowAlignItemsCenter>

        <Collapse in={areMunicipalitiyOptionsExpanded}>
          <CifList>
            {alphabeticallySortedProvincialMunicipalities.map(
              (municipality, municipalityDisplayIndex) => {
                const isMunicipalityChecked =
                  !!locationsCheckedState?.[province]?.municipalitiesChecked?.[
                    municipalityDisplayIndex
                  ]
                return (
                  <CifListItem key={municipality}>
                    <CifLabelIndented>{municipality}</CifLabelIndented>
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
                  </CifListItem>
                )
              },
            )}
          </CifList>
        </Collapse>
      </ColumnFullWidth>
    </CifListItem>
  )
}
