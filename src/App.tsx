import { ThemeProvider } from '@mui/material'

import { Layout } from './components/Layout'
import { themeMui } from './globalStyles/themeMui'
import { H1 } from './components/generic/typography'
import { Map } from './components/Map/Map'
import { Sidebar } from './components/SidebarLeft'

export function App() {
  const title = <H1>Canadian Institute of Forestry - WIP</H1>
  const sideBar = <Sidebar />
  const map = <Map />

  return (
    <ThemeProvider theme={themeMui}>
      <Layout title={title} sideBar={sideBar} map={map} />
    </ThemeProvider>
  )
}
