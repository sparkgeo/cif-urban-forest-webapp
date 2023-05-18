import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  styled,
} from '@mui/material'
import { MouseEvent, SyntheticEvent, useState } from 'react'
import { Download } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'

import {
  SetSearchParametersAndUpdateTrees,
  TreeApiFeatureCollection,
} from '../types/topLevelAppTypes'

import { Column } from './containers'
import { CommonSpecies, Municipalities, Provinces } from '../types/locationsFilterTypes'
import { Loader } from './Loader'
import { LocationsFilter } from './LocationsFilter'
// @ts-ignore.
import { ReactComponent as CifLogo } from '../assets/logo.svg'
import { SpeciesFilter } from './SpeciesFilter'
import { themeMui } from '../globalStyles/themeMui'

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
  const [fileType, setFileType] = useState<string>('csv')
  const treeCount = trees?.features?.length

  const openDownloadModal = () => {
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
    const filterSearchParams = new URLSearchParams(window.location.search)
    filterSearchParams.delete('min_lat')
    filterSearchParams.delete('min_lng')
    filterSearchParams.delete('max_lat')
    filterSearchParams.delete('max_lng')

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
              <StyledTreeCount>
                <div>{treeCount} trees shown</div>
              </StyledTreeCount>
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
                </div>

                <Button
                  variant="contained"
                  color="success"
                  type="button"
                  onClick={openDownloadModal}
                >
                  Download
                </Button>
              </DownloadForm>
            </>
          )}
        </InnerSideBarWrapper>
      </SideBarWrapper>
      <Dialog open={isDownloadModalOpen} onClose={closeDownloadModal}>
        <DialogContent sx={{ minWidth: 300 }}>
          <DialogTitle sx={{ paddingLeft: 0, paddingRight: 0 }}>
            Select file type
            <IconButton
              aria-label="close"
              onClick={closeDownloadModal}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Column as="form">
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="csv"
                  control={<Radio checked={fileType === 'csv'} />}
                  label=".csv"
                  onChange={handleFileTypeChange}
                />
                <FormControlLabel
                  value="json"
                  control={<Radio checked={fileType === 'json'} />}
                  label=".json"
                  onChange={handleFileTypeChange}
                />
                <FormControlLabel
                  value="shp"
                  control={<Radio checked={fileType === 'shp'} />}
                  label=".shp"
                  onChange={handleFileTypeChange}
                />
              </RadioGroup>
            </FormControl>
            <Button
              variant="contained"
              color="success"
              type="button"
              href="#"
              onClick={setDownloadLinkHref}
              download
              sx={{ marginTop: themeMui.spacing(2) }}
            >
              <Download
                sx={{
                  marginRight: themeMui.spacing(0.5),
                }}
              />
              Download
            </Button>
          </Column>
        </DialogContent>
      </Dialog>
    </>
  )
}
