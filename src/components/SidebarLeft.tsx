import { Button, Dialog, styled } from '@mui/material'
import { MouseEvent, SyntheticEvent, useState } from 'react'

import {
  SetSearchParametersAndUpdateTrees,
  TreeApiFeatureCollection,
} from '../types/topLevelAppTypes'

import { CommonSpecies, Municipalities, Provinces } from '../types/locationsFilterTypes'
import { Loader } from './Loader'
import { LocationsFilter } from './LocationsFilter'
// @ts-ignore.
import { ReactComponent as CifLogo } from '../assets/logo.svg'
import { SpeciesFilter } from './SpeciesFilter'
import { themeMui } from '../globalStyles/themeMui'
import { DownloadModalContent } from './DownloadModalContent'
import { TreeDiameterFilter } from './TreeDiameterFilter'

const SideBarWrapper = styled('div')`
  padding: ${themeMui.spacing(3)};
  width: 425px;
  overflow-y: auto;
  direction: rtl;
  scrollbar-width: thin;
  height: 100vh;
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

interface SidebarProps {
  clearSearchParameterTypeAndUpdateTrees: (paramName: string) => void
  commonSpecies: CommonSpecies
  isDataInitializing: boolean
  municipalities: Municipalities
  provinces: Provinces
  setSearchParametersAndUpdateTrees: SetSearchParametersAndUpdateTrees
  trees: TreeApiFeatureCollection
}
export function Sidebar({
  clearSearchParameterTypeAndUpdateTrees,
  commonSpecies,
  isDataInitializing,
  municipalities,
  provinces,
  setSearchParametersAndUpdateTrees,
  trees,
}: SidebarProps) {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false)
  const [fileType, setFileType] = useState<string | undefined>()
  const [isAnyFilterSelected, setIsAnyFilterSelected] = useState<boolean>(false)
  const treeCount = trees?.count

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

  const setDownloadLinkHref = (event: MouseEvent<HTMLAnchorElement>) => {
    const downloadLink = event.currentTarget
    const filterSearchParams = getFilterSearchParameters()

    const treeApiUrl = `${
      import.meta.env.VITE_CIF_URBAN_FOREST_API
    }/trees/search?${filterSearchParams.toString()}&file=${fileType}`

    downloadLink.href = treeApiUrl
  }

  return (
    <>
      <SideBarWrapper>
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
                  <div>{new Intl.NumberFormat().format(treeCount)} trees shown</div>
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
              </DownloadForm>
            </>
          )}
        </InnerSideBarWrapper>
      </SideBarWrapper>
      <Dialog open={isDownloadModalOpen} onClose={closeDownloadModal}>
        <DownloadModalContent
          closeDownloadModal={closeDownloadModal}
          fileType={fileType}
          handleFileTypeChange={handleFileTypeChange}
          isAnyFilterSelected={isAnyFilterSelected}
          setDownloadLinkHref={setDownloadLinkHref}
        />
      </Dialog>
    </>
  )
}
