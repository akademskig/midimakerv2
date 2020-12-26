import { createMuiTheme } from '@material-ui/core/styles';
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#44505f',
      main: '#1f2233',
      dark: '00000f'
    },
    secondary: {
      light: '#ff8654',
      main: '#e85428',
      dark: '#ae1e00'
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