import { styled } from '@mui/material'
import { themeMui } from '../globalStyles/themeMui'
import { LocationsFilter } from './LocationsFilter'
// eslint-disable-next-line
import { ReactComponent as CifLogo } from '../assets/logo.svg'
import { SpeciesFilter } from './SpeciesFilter'

const SideBarWrapper = styled('div')`
  padding: ${themeMui.spacing(3)};
  width: 400px;
`

const StyledCifLogo = styled(CifLogo)`
  margin-bottom: ${themeMui.spacing(3)};
`

export function Sidebar() {
  return (
    <SideBarWrapper>
      <a href="http://www.cif-ifc.org/" target="_blank" rel="noreferrer">
        <StyledCifLogo alt="Canadian Institute of Forestry / Institude forestier du Canada Logo" />
      </a>
      <LocationsFilter />
      <SpeciesFilter />
    </SideBarWrapper>
  )
}
