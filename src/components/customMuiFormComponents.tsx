import { List, ListItem, ListItemProps, ListProps, styled } from '@mui/material'
import { theme } from '../globalStyles/theme'
import { themeMui } from '../globalStyles/themeMui'

export const CifLabel = styled('label')`
  margin: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${themeMui.spacing(1)};
  &:focus-within,
  &:hover {
    background-color: ${theme.color.primary8Percent};
  }
`

export const CifLabelIndented = styled(CifLabel)`
  padding-left: 24px;
`

const CustomStyleListItem = styled(ListItem)`
  padding-right: 0;
`

export function CifList(props: ListProps) {
  return <List dense {...props} />
}

export function CifListItem(props: ListItemProps) {
  return <CustomStyleListItem {...props} />
}
