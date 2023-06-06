import { InfoRounded } from '@mui/icons-material'
import { Tooltip, styled } from '@mui/material'

import { Column, ColumnAlignItemsCenter, Row } from './containers'
import { theme } from '../globalStyles/theme'
import { themeMui } from '../globalStyles/themeMui'

const MapKeyWrapper = styled('div')`
  border-radius: ${theme.border.radius};
  display: flex;
  flex-direction: column;
  padding: 12px 20px;
  background-color: ${theme.color.white};
  box-shadow: ${themeMui.shadows[4]};

  & p {
    margin-top: 0;
    margin-bottom: 0;
    font-size: small;
  }
  & p:first-child {
    text-transform: uppercase;
    margin-bottom: ${themeMui.spacing(1)};
    font-size: medium;
  }
`
const mapKeyHeight = '28px'
const mapKeyWidth = '48px'
const HighTreeDensityKey = styled('div')`
  height: ${mapKeyHeight};
  width: ${mapKeyWidth};
  background-color: ${theme.color.treeDensity.fill.high};
  border-top-left-radius: ${theme.border.radius};
  border-bottom-left-radius: ${theme.border.radius};
`
const MediumTreeDensityKey = styled('div')`
  height: ${mapKeyHeight};
  width: ${mapKeyWidth};
  background-color: ${theme.color.treeDensity.fill.medium};
  margin-left: ${themeMui.spacing(0.4)};
  margin-right: ${themeMui.spacing(0.4)};
`
const LowTreeDensityKey = styled('div')`
  height: ${mapKeyHeight};
  width: ${mapKeyWidth};
  background-color: ${theme.color.treeDensity.fill.low};
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
      <dd>751+ trees</dd>
      <dt>Med:</dt>
      <dd>51-750 trees</dd>
      <dt>Low:</dt>
      <dd>2-50 trees</dd>
    </dl>
  </ToolTipContentWrapper>
)

export function MapKey() {
  return (
    <MapKeyWrapper>
      <p>
        Tree Density{' '}
        <Tooltip title={tooltipContent} placement="top" arrow>
          {/* @ts-ignore */}
          <InfoRounded fontSize="xsmall" sx={{ color: theme.color.opaqueBlack[56] }} />
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
