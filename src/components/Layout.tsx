import { styled } from '@mui/material'

import { ExternalLinks } from './ExternalLinks'
import { MapKey } from './MapKey'
import { themeMui } from '../globalStyles/themeMui'

interface LayoutProps {
  sideBar: JSX.Element
  map: JSX.Element
}

const LayoutWrapper = styled('div')`
  display: flex;
  flex-direction: column;
`

const Main = styled('main')`
  display: flex;
  position: relative; // needed for map key positioning
`

const MapLowerRightFloater = styled('div')`
  display: flex;
  position: absolute;
  bottom: ${themeMui.spacing(5)};
  right: ${themeMui.spacing(2)};
`

export function Layout({ sideBar, map }: LayoutProps) {
  return (
    <LayoutWrapper>
      <Main>
        {sideBar}
        {map}
        <MapLowerRightFloater>
          <ExternalLinks />
          <MapKey />
        </MapLowerRightFloater>
      </Main>
    </LayoutWrapper>
  )
}
