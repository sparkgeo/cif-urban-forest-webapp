import { styled } from '@mui/material'
import { themeMui } from '../globalStyles/themeMui'
import { LocationsFilter } from './LocationsFilter'
// @ts-ignore.
import { ReactComponent as CifLogo } from '../assets/logo.svg'
import { SpeciesFilter } from './SpeciesFilter'
import { SharableUrlParameters, TreeApiFeatureCollection } from '../types/topLevelAppTypes'
import { Municipalities, Provinces } from '../types/locationsFilterTypes'
import { Loader } from './Loader'

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
  provinces: Provinces
  municipalities: Municipalities
  isDataInitializing: boolean
}
export function Sidebar({
  municipalities,
  provinces,
  searchParameters,
  setSearchParametersAndUpdateTrees,
  trees,
  isDataInitializing,
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
            provinces={provinces}
            municipalities={municipalities}
            setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
            searchParameters={searchParameters}
          />
          <SpeciesFilter
            searchParameters={searchParameters}
            setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
          />
        </>
      )}
    </SideBarWrapper>
  )
}
