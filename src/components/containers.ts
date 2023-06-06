import { styled } from '@mui/material'
import { themeMui } from '../globalStyles/themeMui'

export const Column = styled('div')`
  display: flex;
  flex-direction: column;
`

export const ColumnAlignItemsCenter = styled(Column)`
  align-items: center;
`

export const ColumnFullWidth = styled(Column)`
  width: 100%;
`

export const Row = styled('div')`
  display: flex;
  flex-direction: row;
`

export const RowAlignItemsCenter = styled(Row)`
  align-items: center;
`
export const FilterContainer = styled('div')`
  margin-top: ${themeMui.spacing(8)};
`
