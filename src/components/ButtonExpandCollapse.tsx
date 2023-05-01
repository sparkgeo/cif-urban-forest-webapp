import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material'
import { styled } from '@mui/material'

interface ButtonExpandCollapseProps {
  onClick: () => void
  isExpanded: boolean
}

const CustomStyleButton = styled('button')`
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
`

export function ButtonExpandCollapse({ onClick, isExpanded }: ButtonExpandCollapseProps) {
  return (
    <CustomStyleButton type="button" onClick={onClick}>
      {isExpanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
    </CustomStyleButton>
  )
}
