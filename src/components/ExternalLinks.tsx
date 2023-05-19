import styled from '@emotion/styled'
import { Button } from '@mui/material'

import { theme } from '../globalStyles/theme'
import { themeMui } from '../globalStyles/themeMui'

const LinksWrapper = styled('div')`
  margin: auto 0;
`

const ExternalLink = styled(Button)`
  background-color: ${theme.color.white};
  color: ${theme.color.text.secondary};
  margin-right: ${themeMui.spacing(3)};
  box-shadow: ${themeMui.shadows[4]};
  text-transform: uppercase;
  &:hover {
    background-color: ${theme.color.white};
    text-decoration: underline;
    box-shadow: ${themeMui.shadows[8]};
  }
`

export function ExternalLinks() {
  return (
    <LinksWrapper>
      <ExternalLink href="#">Learn more about CIF</ExternalLink>
      <ExternalLink href="#">Glossary of Terms</ExternalLink>
      <ExternalLink href="#">Contact</ExternalLink>
    </LinksWrapper>
  )
}
