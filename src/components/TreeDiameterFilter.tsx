import { Checkbox, Collapse, TextField } from '@mui/material'
import { ChangeEvent, useState } from 'react'

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
  const [isAnyValueForAnySize, setIsValueForAnySize] = useState(false)

  const toggleIsTreeDiameterFilterExpanded = () => {
    setIsTreeDiameterExpanded(!isTreeDiameterFilterExpanded)
  }

  const setTreeDiameterSelectedStatus = () => {
    const filterSearchParams = new URLSearchParams(window.location.search)
    const urlMinDbh = filterSearchParams.get('min_dbh')
    const urlMaxDbh = filterSearchParams.get('max_dbh')

    setIsValueForAnySize(!!urlMinDbh || !!urlMaxDbh)
  }

  const handleSizeChange = ({ event, urlParamName }: handleSizeChangeProps) => {
    const { value } = event.target
    const isValue = value !== ''

    if (isValue) {
      setIsValueForAnySize(true)
      setSearchParametersAndUpdateTrees({
        [urlParamName]: value,
      } as unknown as SharableUrlParameters)
    }
    if (!isValue) {
      clearSearchParameterTypeAndUpdateTrees(urlParamName)

      setTreeDiameterSelectedStatus()
    }
  }

  const handleMinSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSizeChange({ event, urlParamName: 'min_dbh' })
  }

  const handleMaxSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
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
            <TextField type="number" inputProps={{ min: 0 }} onChange={handleMinSizeChange} />
          }
        />
        <CifFormControlLabelIndented
          label="Max Size (cm)"
          control={
            <TextField type="number" inputProps={{ min: 0 }} onChange={handleMaxSizeChange} />
          }
        />
      </Collapse>
    </>
  )
}
