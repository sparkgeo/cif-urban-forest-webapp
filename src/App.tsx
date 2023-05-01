import { ThemeProvider } from '@mui/material'

import { Layout } from './components/Layout'
import { themeMui } from './globalStyles/themeMui'
import { Map } from './components/Map/Map'
import { Sidebar } from './components/SidebarLeft'

export function App() {
  const sideBar = <Sidebar />
  const map = <Map />

  return (
    <ThemeProvider theme={themeMui}>
      <Layout sideBar={sideBar} map={map} />
    </ThemeProvider>
  )
}
