import { styled } from '@mui/material'
import { themeMui } from '../globalStyles/themeMui'
import { LocationsFilter } from './LocationsFilter'
// @ts-ignore.
import { ReactComponent as CifLogo } from '../assets/logo.svg'
import { SpeciesFilter } from './SpeciesFilter'
import { SharableUrlParameters, TreeApiFeatureCollection } from '../types/topLevelAppTypes'

const SideBarWrapper = styled('div')`
  padding: ${themeMui.spacing(3)};
  width: 400px;
`
const StyledCifLogo = styled(CifLogo)`
  margin-bottom: ${themeMui.spacing(5)};
`
const StyledTreeCount = styled('div')`
  font-weight: bold;
  display: flex;
  justify-content: center;
  margin-bottom: ${themeMui.spacing(5)};
`
interface SidebarProps {
  trees: TreeApiFeatureCollection
  searchParameters: SharableUrlParameters
  setSearchParametersAndUpdateTrees: (urlParamaters: SharableUrlParameters) => void
}
export function Sidebar({
  searchParameters,
  setSearchParametersAndUpdateTrees,
  trees,
}: SidebarProps) {
  const treeCount = trees?.features?.length

  return (
    <SideBarWrapper>
      <a href="http://www.cif-ifc.org/" target="_blank" rel="noreferrer">
        <StyledCifLogo alt="Canadian Institute of Forestry / Institude forestier du Canada Logo" />
      </a>
      <StyledTreeCount>
        <div>{treeCount} trees shown</div>
      </StyledTreeCount>

      <LocationsFilter />
      <SpeciesFilter
        searchParameters={searchParameters}
        setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
      />
    </SideBarWrapper>
  )
}
