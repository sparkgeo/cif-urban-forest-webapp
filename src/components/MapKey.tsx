import { InfoRounded } from '@mui/icons-material'
import { Tooltip, styled } from '@mui/material'

import { Column, ColumnAlignItemsCenter, Row } from './containers'
import { theme } from '../globalStyles/theme'
import { themeMui } from '../globalStyles/themeMui'

const MapKeyWrapper = styled('div')`
  position: absolute;
  bottom: ${themeMui.spacing(5)};
  right: ${themeMui.spacing(2)};
  border-radius: ${theme.border.radius};
  display: flex;
  flex-direction: column;
  padding: ${themeMui.spacing(2)};
  background-color: ${theme.color.white};
  box-shadow: ${themeMui.shadows[4]};
  & p {
    margin-top: 0;
    margin-bottom: 0;
  }
  & p:first-child {
    text-transform: uppercase;
    margin-bottom: ${themeMui.spacing(1)};
  }
`
const mapKeyHeight = '28px'
const mapKeyWidth = '48px'
const HighTreeDensityKey = styled('div')`
  height: ${mapKeyHeight};
  width: ${mapKeyWidth};
  background-color: ${theme.color.treeDensity.high};
  border-top-left-radius: ${theme.border.radius};
  border-bottom-left-radius: ${theme.border.radius};
`
const MediumTreeDensityKey = styled('div')`
  height: ${mapKeyHeight};
  width: ${mapKeyWidth};
  background-color: ${theme.color.treeDensity.medium};
  margin-left: ${themeMui.spacing(0.4)};
  margin-right: ${themeMui.spacing(0.4)};
`
const LowTreeDensityKey = styled('div')`
  height: ${mapKeyHeight};
  width: ${mapKeyWidth};
  background-color: ${theme.color.treeDensity.low};
  border-top-right-radius: ${theme.border.radius};
  border-bottom-right-radius: ${theme.border.radius};
`

const ToolTipContentWrapper = styled(Column)`
  & p {
    margin-top: 0;
    margin-bottom: ${themeMui.spacing(0.25)};
  }
  & dl {
    display: grid;
  }
  & dt {
    grid-column-start: 1;
  }
  & dd {
    grid-column-start: 2;
    margin-left: ${themeMui.spacing(1)};
  }
`

const tooltipContent = (
  <ToolTipContentWrapper>
    <p>Tree Density</p>
    <dl>
      <dt>High:</dt>
      <dd>classification buckets tbd</dd>
      <dt>Med:</dt>
      <dd>classification buckets tbd</dd>
      <dt>Low:</dt>
      <dd>classification buckets tbd</dd>
    </dl>
  </ToolTipContentWrapper>
)

export function MapKey() {
  return (
    <MapKeyWrapper>
      <p>
        Tree Density{' '}
        <Tooltip title={tooltipContent} placement="top" arrow>
          <InfoRounded fontSize="small" />
        </Tooltip>
      </p>

      <Row>
        <ColumnAlignItemsCenter>
          <HighTreeDensityKey /> <p>High</p>
        </ColumnAlignItemsCenter>
        <ColumnAlignItemsCenter>
          <MediumTreeDensityKey /> <p>Med</p>
        </ColumnAlignItemsCenter>
        <ColumnAlignItemsCenter>
          <LowTreeDensityKey /> <p>Low</p>
        </ColumnAlignItemsCenter>
      </Row>
    </MapKeyWrapper>
  )
}
