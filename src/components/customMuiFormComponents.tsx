import {
  FormControlLabel,
  FormControlLabelProps,
  List,
  ListItem,
  ListItemProps,
  ListProps,
  styled,
} from '@mui/material'

const CustomStyleFormControlLabel = styled(FormControlLabel)`
  margin: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const CustomStyleListItem = styled(ListItem)`
  padding-right: 0;
`

export function CifFormControlLabel(props: FormControlLabelProps) {
  return <CustomStyleFormControlLabel labelPlacement="start" {...props} />
}

export function CifList(props: ListProps) {
  return <List dense {...props} />
}

export function CifListItem(props: ListItemProps) {
  return <CustomStyleListItem {...props} />
}
