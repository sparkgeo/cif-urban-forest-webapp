import { styled } from '@mui/material'
import { theme } from '../styles/theme'

interface LayoutProps {
  title: JSX.Element
  sideBar: JSX.Element
  map: JSX.Element
}

const LayoutWrapper = styled('div')`
  display: flex;
  flex-direction: column;
`

const Header = styled('header')`
  padding: ${theme.spacing(1)};
  background-color: ${theme.color.primary};
  height: ${theme.layout.headerHeight};
`

const Main = styled('main')`
  display: flex;
`

export function Layout({ title, sideBar, map }: LayoutProps) {
  return (
    <LayoutWrapper>
      <Header>{title}</Header>

      <Main>
        {sideBar}
        {map}
      </Main>
    </LayoutWrapper>
  )
}