import ReactMapGl from 'react-map-gl'
import { ThemeProvider, styled } from '@mui/material'

import { Layout } from './components/Layout'
import { themeMui } from './styles/themeMui'
import { H1 } from './components/generic/typography'
import { theme } from './styles/theme'

const SideBarWrapper = styled('div')``

export function App() {
  const title = <H1>Canadian Institute of Forestry - WIP</H1>
  const sideBar = <SideBarWrapper>sidebar placeholder</SideBarWrapper>
  const map = (
    <ReactMapGl
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: '100%', height: theme.layout.mapHeight }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  )

  return (
    <ThemeProvider theme={themeMui}>
      <Layout title={title} sideBar={sideBar} map={map} />
    </ThemeProvider>
  )
}
