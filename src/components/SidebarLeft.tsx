import { styled } from '@mui/material'
import {
  SetSearchParametersAndUpdateTrees,
  TreeApiFeatureCollection,
} from '../types/topLevelAppTypes'

import { Loader } from './Loader'
import { LocationsFilter } from './LocationsFilter'
import { Municipalities, Provinces } from '../types/locationsFilterTypes'
// @ts-ignore.
import { ReactComponent as CifLogo } from '../assets/logo.svg'
import { SpeciesFilter } from './SpeciesFilter'
import { themeMui } from '../globalStyles/themeMui'

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
  clearSearchParameterTypeAndUpdateTrees: (paramName: string) => void
  isDataInitializing: boolean
  municipalities: Municipalities
  provinces: Provinces
  setSearchParametersAndUpdateTrees: SetSearchParametersAndUpdateTrees
  trees: TreeApiFeatureCollection
}
export function Sidebar({
  clearSearchParameterTypeAndUpdateTrees,
  isDataInitializing,
  municipalities,
  provinces,
  setSearchParametersAndUpdateTrees,
  trees,
}: SidebarProps) {
  const treeCount = trees?.features?.length

  return (
    <SideBarWrapper>
      <a href="http://www.cif-ifc.org/" target="_blank" rel="noreferrer">
        <StyledCifLogo alt="Canadian Institute of Forestry / Institude forestier du Canada Logo" />
      </a>
      {isDataInitializing ? (
        <Loader />
      ) : (
        <>
          <StyledTreeCount>
            <div>{treeCount} trees shown</div>
          </StyledTreeCount>

          <LocationsFilter
            clearSearchParameterTypeAndUpdateTrees={clearSearchParameterTypeAndUpdateTrees}
            municipalities={municipalities}
            provinces={provinces}
            setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
          />
          <SpeciesFilter
            clearSearchParameterTypeAndUpdateTrees={clearSearchParameterTypeAndUpdateTrees}
            setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
          />
        </>
      )}
    </SideBarWrapper>
  )
}
