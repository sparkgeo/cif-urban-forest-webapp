import { styled } from '@mui/material'
import { themeMui } from '../globalStyles/themeMui'
import { LocationsFilter } from './LocationsFilter'

const SideBarWrapper = styled('div')`
  padding: ${themeMui.spacing(3)};
  width: 400px;
`

export function Sidebar() {
  return (
    <SideBarWrapper>
      <LocationsFilter />
    </SideBarWrapper>
  )
}
