import { Autocomplete, Checkbox, Collapse, TextField } from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'

import { ButtonExpandCollapse } from './ButtonExpandCollapse'
import { CifFormControlLabel } from './customMuiFormComponents'
import { RowAlignItemsCenter } from './containers'
import { SetSearchParametersAndUpdateTrees, SharableUrlParameters } from '../types/topLevelAppTypes'
import { CommonSpecies } from '../types/locationsFilterTypes'

// interface SpeciesSingular {
//   label: string
//   id: string | number
// }

// interface OtherSpeciesNames {
//   [key: string | number]: SpeciesSingular[]
// }
// interface SpeciesOptions {
//   masterSpeciesNames: SpeciesSingular[]
//   otherNames: OtherSpeciesNames
// }
// const speciesOptions: SpeciesOptions = {
//   masterSpeciesNames: [
//     { label: 'fir (placeholder)', id: '1' },
//     { label: 'hemlock (placeholder)', id: 2 },
//     { label: 'maple (placeholder)', id: 3 },
//   ],
//   otherNames: {
//     1: [
//       { label: 'a', id: 10 },
//       { label: 'b', id: 20 },
//     ],
//     3: [
//       { label: 'e', id: 30 },
//       { label: 'f', id: 40 },
//     ],
//   },
// }
// interface OptionLabelWithTooltipProps {
//   option: SpeciesSingular
// }

// const OptionLabelWithTooltip = function OptionLabelWithTooltip({
//   option,
//   ...restOfProps
// }: OptionLabelWithTooltipProps) {
//   const otherNames = null

//   const otherNamesList = otherNames ? (
//     <List>
//       {/* {speciesOptions.otherNames?.[option.id]?.map(({ label, id }) => (
//         <ListItem key={id}>{label}</ListItem>
//       ))} */}
//     </List>
//   ) : null

//   return (
//     <Tooltip title={otherNamesList} placement="right" arrow>
//       <span {...restOfProps}>{option.label}</span>
//     </Tooltip>
//   )
// }

interface SpeciesFilterProps {
  clearSearchParameterTypeAndUpdateTrees: (paramName: string) => void
  commonSpecies: CommonSpecies
  setSearchParametersAndUpdateTrees: SetSearchParametersAndUpdateTrees
}

export function SpeciesFilter({
  clearSearchParameterTypeAndUpdateTrees,
  commonSpecies,
  setSearchParametersAndUpdateTrees,
}: SpeciesFilterProps) {
  const [isSpeciesFilterExpanded, setIsSpeciesFilterExpanded] = useState(false)
  const [selectedValues, setSelectedValues] = useState<CommonSpecies>([])

  const isAnySpeciesSelected = !!selectedValues.length
  const isSpeciesCheckboxIndeterminate =
    isAnySpeciesSelected && selectedValues.length < commonSpecies.length

  useEffect(function loadUrlParameterValuesIntoInitialFormState() {
    const initialQueryParameters = new URLSearchParams(window.location.search)
    const initialSpeciesQueryParameters = initialQueryParameters.getAll('common_species')

    setSelectedValues(Array.from(initialSpeciesQueryParameters.values()))
  }, [])

  const toggleIsSpeciesFilterExpanded = () => {
    setIsSpeciesFilterExpanded(!isSpeciesFilterExpanded)
  }

  const handleSpeciesAutocompleteOnChange = (
    event: SyntheticEvent<Element, Event>,
    value: CommonSpecies,
  ) => {
    const selectedSpecies = value

    setSelectedValues(selectedSpecies)
    const areSpeciesSelected = !!selectedSpecies.length

    if (!areSpeciesSelected) {
      clearSearchParameterTypeAndUpdateTrees('common_species')

      return
    }

    setSearchParametersAndUpdateTrees({
      common_species: selectedSpecies,
    } as SharableUrlParameters)
  }

  return (
    <>
      <RowAlignItemsCenter>
        <ButtonExpandCollapse
          onClick={toggleIsSpeciesFilterExpanded}
          isExpanded={isSpeciesFilterExpanded}
        />
        <CifFormControlLabel
          label="Tree Species"
          control={
            <Checkbox
              checked={isAnySpeciesSelected}
              indeterminate={isSpeciesCheckboxIndeterminate}
              onClick={toggleIsSpeciesFilterExpanded}
            />
          }
        />
      </RowAlignItemsCenter>
      <Collapse in={isSpeciesFilterExpanded}>
        <Autocomplete
          multiple
          options={commonSpecies}
          getOptionLabel={(option) => option}
          // renderOption={(props, option) => <OptionLabelWithTooltip option={option} {...props} />}
          renderInput={(params) => <TextField {...params} label="Species" />}
          onChange={handleSpeciesAutocompleteOnChange}
          value={selectedValues}
          filterSelectedOptions
        />
      </Collapse>
    </>
  )
}
