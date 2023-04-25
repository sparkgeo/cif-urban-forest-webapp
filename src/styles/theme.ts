const color = {
  primary: '#2596be',
  secondary: '#eab676',
}
const headerHeight = '70px'
const layout = {
  headerHeight,
  mapHeight: `calc(100vh - ${headerHeight})`,
}

const spacing = (factor: number) => `${0.5 * factor}rem`

const typography = {
  fontStack: ['Open Sans', 'sans-serif'],
  xsmallFontSize: '1rem',
  smallFontSize: '1.5rem',
  fontSize: '2rem',
  largeFontSize: '2.5rem',
  xlargeFontSize: '3rem',
}
export const theme = { color, spacing, typography, layout }
