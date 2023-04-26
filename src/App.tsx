import { ThemeProvider, styled } from '@mui/material'

import { useState } from 'react'
import { LngLatBounds } from 'mapbox-gl'
import { Layout } from './components/Layout'
import { themeMui } from './styles/themeMui'
import { H1 } from './components/generic/typography'
import { Map } from './components/Map'

const SideBarWrapper = styled('div')``

export function App() {
  const [mapBounds, setMapBounds] = useState<LngLatBounds>()
  const title = <H1>Canadian Institute of Forestry - WIP</H1>
  const sideBar = <SideBarWrapper>sidebar placeholder</SideBarWrapper>
  const map = <Map bounds={mapBounds} setBounds={setMapBounds} />

  return (
    <ThemeProvider theme={themeMui}>
      <Layout title={title} sideBar={sideBar} map={map} />
    </ThemeProvider>
  )
}
