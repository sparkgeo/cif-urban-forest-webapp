import { Autocomplete, Checkbox, Collapse, List, ListItem, TextField, Tooltip } from '@mui/material'
import { ChangeEvent, useState } from 'react'

import { ButtonExpandCollapse } from './ButtonExpandCollapse'
import { CifFormControlLabel } from './customMuiFormComponents'
import { RowAlignItemsCenter } from './containers'

interface SpeciesSingular {
  label: string
  id: string | number
}

interface OtherSpeciesNames {
  [key: string | number]: SpeciesSingular[]
}
interface SpeciesOptions {
  masterSpeciesNames: SpeciesSingular[]
  otherNames: OtherSpeciesNames
}
const speciesOptions: SpeciesOptions = {
  masterSpeciesNames: [
    { label: 'fir', id: '1' },
    { label: 'hemlock', id: 2 },
    { label: 'big leaf maple', id: 3 },
  ],
  otherNames: {
    1: [
      { label: 'a', id: 10 },
      { label: 'b', id: 20 },
    ],
    3: [
      { label: 'e', id: 30 },
      { label: 'f', id: 40 },
    ],
  },
}
interface OptionLabelWithTooltipProps {
  option: SpeciesSingular
}
const OptionLabelWithTooltip = function OptionLabelWithTooltip({
  option,
  ...restOfProps
}: OptionLabelWithTooltipProps) {
  const otherNames = speciesOptions.otherNames?.[option.id]?.length
    ? speciesOptions.otherNames?.[option.id]
    : null

  const otherNamesList = otherNames ? (
    <List>
      {speciesOptions.otherNames?.[option.id]?.map(({ label, id }) => (
        <ListItem key={id}>{label}</ListItem>
      ))}
    </List>
  ) : null

  return (
    <Tooltip title={otherNamesList} placement="right" arrow>
      <span {...restOfProps}>{option.label}</span>
    </Tooltip>
  )
}

export function SpeciesFilter() {
  const [isSpeciesFilterExpanded, setIsSpeciesFilterExpanded] = useState(false)
  const isSpeciesCheckboxIndeterminate = false
  const isAnySpeciesSelected = false

  const toggleIsSpeciesFilterExpanded = () => {
    setIsSpeciesFilterExpanded(!isSpeciesFilterExpanded)
  }
  const handleSpeciesCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked

    if (isChecked) {
      setIsSpeciesFilterExpanded(true)
    }
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
              onChange={handleSpeciesCheckboxChange}
            />
          }
        />
      </RowAlignItemsCenter>
      <Collapse in={isSpeciesFilterExpanded}>
        <Autocomplete
          multiple
          options={speciesOptions.masterSpeciesNames}
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => <OptionLabelWithTooltip option={option} {...props} />}
          renderInput={(params) => <TextField {...params} label="Species" />}
        />
      </Collapse>
    </>
  )
}
