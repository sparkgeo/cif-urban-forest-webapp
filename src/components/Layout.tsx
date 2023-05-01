import { styled } from '@mui/material'

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
`

export function Layout({ sideBar, map }: LayoutProps) {
  return (
    <LayoutWrapper>
      <Main>
        {sideBar}
        {map}
      </Main>
    </LayoutWrapper>
  )
}
