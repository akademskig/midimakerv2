import { createTheme } from '@material-ui/core/styles';
const theme = createTheme({
  palette: {
    primary: {
      light: '#4973ac',
      main: '#283c59',
      dark: '#1d2d44'
    },
    secondary: {
      light: '#e551ff',
      main: '#af00cb',
      dark: '#7b0099'
    },
    error:{
      light: '#ff4d4d',
      main: '#ff0000',
      dark: '#b30000'
    }
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