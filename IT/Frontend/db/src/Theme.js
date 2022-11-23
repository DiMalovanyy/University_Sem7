import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#ccd5ae',
      light: '#e9edc9',
      dark: '#8E9579',
    },
    secondary: {
      main: '#D4A373',
      light: '#DCB58F',
      dark: '#947250',
    },
    background: {
      default: '#FEFAE0',
    },
  },
});