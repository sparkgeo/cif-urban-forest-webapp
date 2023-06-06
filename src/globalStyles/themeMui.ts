import { createTheme } from '@mui/material/styles'
import { theme } from './theme'

export const themeMui = createTheme({
  typography: {
    fontFamily: theme.typography.fontStack.join(','),
    htmlFontSize: 10,
  },
  palette: {
    primary: {
      main: theme.color.primary,
    },
    secondary: {
      main: theme.color.secondary,
    },
  },
  components: {
    MuiTooltip: { styleOverrides: { tooltip: { backgroundColor: theme.color.tooltipBackground } } },
  },
})
