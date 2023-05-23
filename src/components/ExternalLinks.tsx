import styled from '@emotion/styled'
import { Button, ButtonProps } from '@mui/material'

import { theme } from '../globalStyles/theme'
import { themeMui } from '../globalStyles/themeMui'

const ButtonLink = styled(Button)`
  background-color: ${theme.color.white};
  color: ${theme.color.text.secondary};
  margin-right: ${themeMui.spacing(3)};
  box-shadow: ${themeMui.shadows[5]};
  text-transform: uppercase;
  border-radius: 100px;
  &:hover {
    background-color: #f5f5f5;
  }
`

function ExternalLink(props: ButtonProps) {
  const { children, ...restOfProps } = props
  return (
    <ButtonLink size="medium" variant="contained" {...restOfProps}>
      {children}
    </ButtonLink>
  )
}

export function ExternalLinks() {
  return (
    <>
      <ExternalLink href="#">Learn more about CIF</ExternalLink>
      <ExternalLink href="#">Glossary of Terms</ExternalLink>
      <ExternalLink href="#">Contact</ExternalLink>
    </>
  )
}
