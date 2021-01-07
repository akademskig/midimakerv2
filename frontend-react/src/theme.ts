import { createMuiTheme } from '@material-ui/core/styles';
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#355975',
      main: '#003049',
      dark: '#000722'
    },
    secondary: {
      light: '#e551ff',
      main: '#af00cb',
      dark: '#7b0099'
    },
  },
  breakpoints: {
    values: {
      xs: 376,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    }
  },
});
export default theme

// //secondary blue
// secondary: {
//   light: '#63caff',
//   main: '#009ae5',
//   dark: '#006bb2'
// },