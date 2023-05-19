import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  styled,
} from '@mui/material'
import { Download } from '@mui/icons-material'
import { SyntheticEvent, MouseEvent } from 'react'
import CloseIcon from '@mui/icons-material/Close'

import { Column, Row } from './containers'
import { themeMui } from '../globalStyles/themeMui'

interface DownloadModalContentProps {
  closeDownloadModal: () => void
  fileType: string
  handleFileTypeChange: (event: SyntheticEvent<Element, Event>) => void
  isAnyFilterSelected: boolean
  setDownloadLinkHref: (event: MouseEvent<HTMLAnchorElement>) => void
}

const ErrorButtonWrapper = styled(Row)`
  justify-content: end;
`

export function DownloadModalContent({
  closeDownloadModal,
  fileType,
  handleFileTypeChange,
  isAnyFilterSelected,
  setDownloadLinkHref,
}: DownloadModalContentProps) {
  const filterSelectedContent = (
    <>
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
          <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group">
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
    </>
  )

  const noFilterSelectedContent = (
    <>
      <DialogTitle sx={{ paddingLeft: 0, paddingRight: 0 }}>Error: No Data Selected</DialogTitle>
      <p>
        You attempted to download data without making a selection. Please choose the desired data
        before initiating the download.
      </p>
      <ErrorButtonWrapper>
        <Button variant="contained" onClick={closeDownloadModal} color="error">
          OK
        </Button>
      </ErrorButtonWrapper>
    </>
  )
  return (
    <DialogContent sx={{ minWidth: 300 }}>
      {isAnyFilterSelected ? filterSelectedContent : noFilterSelectedContent}
    </DialogContent>
  )
}
