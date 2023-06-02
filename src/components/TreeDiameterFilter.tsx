import { Checkbox, Collapse, TextField } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'

import { ButtonExpandCollapse } from './ButtonExpandCollapse'
import { CifFormControlLabel, CifFormControlLabelIndented } from './customMuiFormComponents'
import { RowAlignItemsCenter } from './containers'
import { SetSearchParametersAndUpdateTrees, SharableUrlParameters } from '../types/topLevelAppTypes'

interface TreeDiameterFilterProps {
  clearSearchParameterTypeAndUpdateTrees: (paramName: string) => void
  setSearchParametersAndUpdateTrees: SetSearchParametersAndUpdateTrees
}

interface handleSizeChangeProps {
  event: ChangeEvent<HTMLInputElement>
  urlParamName: string
}

export function TreeDiameterFilter({
  clearSearchParameterTypeAndUpdateTrees,
  setSearchParametersAndUpdateTrees,
}: TreeDiameterFilterProps) {
  const [isTreeDiameterFilterExpanded, setIsTreeDiameterExpanded] = useState(false)
  const [minTreeDiameter, setMinTreeDiameter] = useState<string>('')
  const [maxTreeDiameter, setMaxTreeDiameter] = useState<string>('')
  const isAnyValueForAnySize = !!maxTreeDiameter || !!minTreeDiameter

  useEffect(function loadInitialTreeDiameterValuesFromUrl() {
    const initialQueryParameters = new URLSearchParams(window.location.search)
    const initialMaxTreeDiameter = initialQueryParameters.get('max_dbh')
    const initialMinTreeDiameter = initialQueryParameters.get('min_dbh')

    setMaxTreeDiameter(initialMaxTreeDiameter ?? '')
    setMinTreeDiameter(initialMinTreeDiameter ?? '')
  }, [])

  const toggleIsTreeDiameterFilterExpanded = () => {
    setIsTreeDiameterExpanded(!isTreeDiameterFilterExpanded)
  }

  const handleSizeChange = ({ event, urlParamName }: handleSizeChangeProps) => {
    const { value } = event.target
    const isValue = value !== ''

    if (isValue) {
      setSearchParametersAndUpdateTrees({
        [urlParamName]: value,
      } as unknown as SharableUrlParameters)
    }
    if (!isValue) {
      clearSearchParameterTypeAndUpdateTrees(urlParamName)
    }
  }

  const handleMinSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMinTreeDiameter(event.target.value)
    handleSizeChange({ event, urlParamName: 'min_dbh' })
  }

  const handleMaxSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMaxTreeDiameter(event.target.value)
    handleSizeChange({ event, urlParamName: 'max_dbh' })
  }

  return (
    <>
      <RowAlignItemsCenter>
        <ButtonExpandCollapse
          onClick={toggleIsTreeDiameterFilterExpanded}
          isExpanded={isTreeDiameterFilterExpanded}
        />
        <CifFormControlLabel
          label="Tree Diameter (DBH)"
          control={<Checkbox checked={isAnyValueForAnySize} />}
        />
      </RowAlignItemsCenter>
      <Collapse in={isTreeDiameterFilterExpanded}>
        <CifFormControlLabelIndented
          label="Min Size (cm)"
          control={
            <TextField
              inputProps={{ min: 0 }}
              onChange={handleMinSizeChange}
              type="number"
              value={minTreeDiameter}
            />
          }
        />
        <CifFormControlLabelIndented
          label="Max Size (cm)"
          control={
            <TextField
              inputProps={{ min: 0 }}
              onChange={handleMaxSizeChange}
              type="number"
              value={maxTreeDiameter}
            />
          }
        />
      </Collapse>
    </>
  )
}
