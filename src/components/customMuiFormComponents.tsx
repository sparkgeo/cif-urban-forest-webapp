import {
  FormControlLabel,
  FormControlLabelProps,
  List,
  ListItem,
  ListItemProps,
  ListProps,
  styled,
} from '@mui/material'
import { theme } from '../globalStyles/theme'
import { themeMui } from '../globalStyles/themeMui'

const CustomStyleFormControlLabel = styled(FormControlLabel)`
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

const CustomStyleFormControlLabelIndented = styled(CustomStyleFormControlLabel)`
  padding-left: 24px;
`

const CustomStyleListItem = styled(ListItem)`
  padding-right: 0;
`

export function CifFormControlLabel(props: FormControlLabelProps) {
  return <CustomStyleFormControlLabel labelPlacement="start" {...props} />
}

export function CifFormControlLabelIndented(props: FormControlLabelProps) {
  return <CustomStyleFormControlLabelIndented labelPlacement="start" {...props} />
}

export function CifList(props: ListProps) {
  return <List dense {...props} />
}

export function CifListItem(props: ListItemProps) {
  return <CustomStyleListItem {...props} />
}
