import { createMuiTheme } from '@material-ui/core/styles'
// solarized colors
export const base03 = '#002b36'
export const base02 = '#073642'
export const base01 = '#586e75'
export const base00 = '#657b83'
export const base0 = '#839496'
export const base1 = '#93a1a1'
export const base2 = '#eee8d5'
export const base3 = '#fdf6e3'
export const yellow = '#b58900'
export const orange = '#cb4b16'
export const red = '#dc322f'
export const magenta = '#d33682'
export const violet = '#6c71c4'
export const blue = '#268bd2'
export const cyan = '#2aa198'
export const green = '#859900'

export default createMuiTheme({
  overrides: {
    MuiButton: {},
  },
  palette: {
    type: 'dark',
    primary: {
      main: cyan,
    },
    secondary: {
      main: violet,
    },
    error: {
      main: red,
    },
    success: {
      main: blue,
    },
    info: {
      main: yellow,
    },
    warning: {
      main: orange,
    },
    text: {
      primary: base1,
      secondary: base0,
    },
    background: {
      default: '#212121',
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    // contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    // tonalOffset: 0.2,
  },
})
