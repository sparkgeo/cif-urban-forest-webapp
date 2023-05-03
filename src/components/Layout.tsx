import { styled } from '@mui/material'
import { MapKey } from './MapKey'

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

export function Layout({ sideBar, map }: LayoutProps) {
  return (
    <LayoutWrapper>
      <Main>
        {sideBar}
        {map}
        <MapKey />
      </Main>
    </LayoutWrapper>
  )
}
