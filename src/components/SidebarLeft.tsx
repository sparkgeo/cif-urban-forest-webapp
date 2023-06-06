import { Button, Dialog, styled } from '@mui/material'
import { ChangeEvent, MouseEvent, SyntheticEvent, useReducer, useState } from 'react'
import { RefreshRounded } from '@mui/icons-material'

import { CommonSpecies, Municipalities, Provinces } from '../types/locationsFilterTypes'
import { DownloadModalContent } from './DownloadModalContent'
import { Loader } from './Loader'
import { LocationsFilter } from './LocationsFilter'
// @ts-ignore.
import { ReactComponent as CifLogo } from '../assets/logo.svg'
import { SetSearchParametersAndUpdateTrees } from '../types/topLevelAppTypes'
import { SpeciesFilter } from './SpeciesFilter'
import { theme } from '../globalStyles/theme'
import { themeMui } from '../globalStyles/themeMui'
import { TreeDiameterFilter } from './TreeDiameterFilter'

const SideBarWrapper = styled('div')`
  padding: ${themeMui.spacing(3)};
  width: 425px;
  overflow-y: auto;
  direction: rtl;
  scrollbar-width: thin;
  height: 100vh;
  box-shadow: ${themeMui.shadows[9]};
  z-index: 1;
`
const InnerSideBarWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  direction: ltr;
  height: 100%;
  & a > svg {
    width: 100%;
  }
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

const DownloadForm = styled('form')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`

const DownloadButtonWrapper = styled('div')`
  background-color: ${theme.color.white};
  display: flex;
  flex-direction: column;
  bottom: -${themeMui.spacing(3)};
  margin-top: ${themeMui.spacing(3)};
  padding-bottom: ${themeMui.spacing(3)};
  position: sticky;
  & button:nth-child(2) {
    width: 100%;
  }
`

const ClearFilterButton = styled('button')`
  align-items: center;
  align-self: flex-end;
  background-color: transparent;
  border: none;
  display: flex;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: ${themeMui.spacing(2)};
  min-width: max-content;
  text-transform: uppercase;
  &:hover {
    color: ${theme.color.primary};
  }
  & svg {
    font-size: inherit;
    margin-right: ${themeMui.spacing(1)};
  }
`

interface SidebarProps {
  clearAllSearchParametersAndUpdateTrees: () => void
  clearSearchParameterTypeAndUpdateTrees: (paramName: string) => void
  commonSpecies: CommonSpecies
  isDataInitializing: boolean
  municipalities: Municipalities
  provinces: Provinces
  setSearchParametersAndUpdateTrees: SetSearchParametersAndUpdateTrees
  treeCount: number | undefined
}
export function SidebarLeft({
  clearAllSearchParametersAndUpdateTrees,
  clearSearchParameterTypeAndUpdateTrees,
  commonSpecies,
  isDataInitializing,
  municipalities,
  provinces,
  setSearchParametersAndUpdateTrees,
  treeCount,
}: SidebarProps) {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false)
  const [fileType, setFileType] = useState<string | undefined>()
  const [isAnyFilterSelected, setIsAnyFilterSelected] = useState<boolean>(false)
  const [isExclusionDataIncluded, setIsExclusionDataIncluded] = useState<boolean>(false)
  const [hackToForceFilterReset, forceFiltersToReset] = useReducer((value) => value + 1, 0)

  const getFilterSearchParameters = () => {
    const filterSearchParams = new URLSearchParams(window.location.search)
    filterSearchParams.delete('min_lat')
    filterSearchParams.delete('min_lng')
    filterSearchParams.delete('max_lat')
    filterSearchParams.delete('max_lng')

    return filterSearchParams
  }

  const setFilterSelectedStatus = () => {
    const filterSearchParams = getFilterSearchParameters()
    // @ts-ignore
    setIsAnyFilterSelected(!!filterSearchParams.size)
  }

  const openDownloadModal = () => {
    setFilterSelectedStatus()
    setIsDownloadModalOpen(true)
  }

  const closeDownloadModal = () => {
    setIsDownloadModalOpen(false)
  }
  const handleFileTypeChange = (event: SyntheticEvent<Element, Event>) => {
    const { currentTarget } = event
    setFileType((currentTarget as HTMLInputElement).value)
  }
  const handleExclusionDataChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsExclusionDataIncluded(event.target.checked)
  }

  const setDownloadLinkHref = (event: MouseEvent<HTMLAnchorElement>) => {
    const downloadLink = event.currentTarget
    const filterSearchParams = getFilterSearchParameters()

    const treeApiUrl = `${
      import.meta.env.VITE_CIF_URBAN_FOREST_API
    }/trees/search?${filterSearchParams.toString()}&file=${fileType}&return_all=${isExclusionDataIncluded}`

    downloadLink.href = treeApiUrl
  }

  const handleClearFilterClick = () => {
    clearAllSearchParametersAndUpdateTrees()
    forceFiltersToReset()
  }

  return (
    <>
      <SideBarWrapper key={hackToForceFilterReset}>
        <InnerSideBarWrapper>
          <a href="http://www.cif-ifc.org/" target="_blank" rel="noreferrer">
            <StyledCifLogo alt="Canadian Institute of Forestry / Institude forestier du Canada Logo" />
          </a>
          {isDataInitializing ? (
            <Loader />
          ) : (
            <>
              {treeCount ? (
                <StyledTreeCount>
                  <div>{new Intl.NumberFormat().format(treeCount)} Trees Shown</div>
                </StyledTreeCount>
              ) : null}

              <DownloadForm>
                <div>
                  <LocationsFilter
                    clearSearchParameterTypeAndUpdateTrees={clearSearchParameterTypeAndUpdateTrees}
                    municipalities={municipalities}
                    provinces={provinces}
                    setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
                  />
                  <SpeciesFilter
                    clearSearchParameterTypeAndUpdateTrees={clearSearchParameterTypeAndUpdateTrees}
                    setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
                    commonSpecies={commonSpecies}
                  />
                  <TreeDiameterFilter
                    clearSearchParameterTypeAndUpdateTrees={clearSearchParameterTypeAndUpdateTrees}
                    setSearchParametersAndUpdateTrees={setSearchParametersAndUpdateTrees}
                  />
                </div>
                <DownloadButtonWrapper>
                  <ClearFilterButton type="button" onClick={handleClearFilterClick}>
                    <RefreshRounded />
                    Clear Filters
                  </ClearFilterButton>
                  <Button
                    variant="contained"
                    color="success"
                    type="button"
                    onClick={openDownloadModal}
                    disableElevation
                    size="large"
                  >
                    Download
                  </Button>
                </DownloadButtonWrapper>
              </DownloadForm>
            </>
          )}
        </InnerSideBarWrapper>
      </SideBarWrapper>
      <Dialog open={isDownloadModalOpen} onClose={closeDownloadModal}>
        <DownloadModalContent
          closeDownloadModal={closeDownloadModal}
          fileType={fileType}
          handleExclusionDataChange={handleExclusionDataChange}
          handleFileTypeChange={handleFileTypeChange}
          isAnyFilterSelected={isAnyFilterSelected}
          setDownloadLinkHref={setDownloadLinkHref}
          isExclusionDataIncluded={isExclusionDataIncluded}
        />
      </Dialog>
    </>
  )
}
