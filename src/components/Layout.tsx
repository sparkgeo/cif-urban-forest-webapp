import { Alert, styled } from '@mui/material'

import { ExternalLinks } from './ExternalLinks'
import { MapKey } from './MapKey'
import { themeMui } from '../globalStyles/themeMui'

interface LayoutProps {
  sideBar: JSX.Element
  map: JSX.Element
  errorText: string[]
  clearErrorText: (errorText: string) => void
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
  align-items: flex-end;
  bottom: ${themeMui.spacing(5)};
  right: ${themeMui.spacing(4)};
`

const MapWrapper = styled('div')`
  width: 100%;
  height: 100%;
  position: relative;
`

const AlertContainer = styled('div')`
  position: absolute;
  width: 100%;
  top: 0;
  right: 0;
  z-index: 3;
`

export function Layout({ sideBar, map, errorText, clearErrorText }: LayoutProps) {
  return (
    <LayoutWrapper>
      <Main>
        {sideBar}
        <MapWrapper>
          {errorText.length ? (
            <AlertContainer>
              {errorText.map((error) => (
                <Alert
                  variant="filled"
                  severity="error"
                  onClose={() => clearErrorText(error)}
                  sx={{ marginBottom: themeMui.spacing(1) }}
                >
                  {error}
                </Alert>
              ))}
            </AlertContainer>
          ) : null}

          {map}
        </MapWrapper>
        <MapLowerRightFloater>
          <ExternalLinks />
          <MapKey />
        </MapLowerRightFloater>
      </Main>
    </LayoutWrapper>
  )
}
