import { CircularProgress, CircularProgressProps, styled } from '@mui/material'

const LoaderWrapper = styled('div')`
  display: flex;
  justify-content: center;
`
export function Loader(props: CircularProgressProps) {
  return (
    <LoaderWrapper>
      <CircularProgress {...props} />
    </LoaderWrapper>
  )
}
