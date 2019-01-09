
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  design: {
    id: "att",
    name: "AT&T",
    url: "https://pmcvariety.files.wordpress.com/2016/04/att_logo.jpg?w=1000&h=563&crop=1",
    height: 70,
    width: 150,
    logoHeight: 60,
  },
  palette: {
    type: "light",
    common: {
      black: "#000",
      white: "#fff"
    },
    background: {
      paper: "#f2f2f2",
      default: "#fafafa"
    },
    primary: {
      light: "#f2f2f29c",
      main: "#f2f2f2",
      dark: "#d5d5d5",
      contrastText: "#0094d3"
    },
    secondary: {
      light: "#f2f2f2",
      main: "rgba(51, 171, 226, 1)",
      dark: "rgba(41, 159, 213, 1)",
      contrastText: "#fff"
    },
    action: {
      active: "#e0e0e0",
      hover: "rgba(0, 0, 0, 0.08)",
      hoverOpacity: 0.08,
      selected: "rgba(255, 255, 255, 0.14)",
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)"
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff"
    },
    text: {
      primary: "#0094d3",
      secondary: "#000",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.71)"
    }
  },
  spacing: {
    unit: 5
  },

  overrides: {
    MuiTableCell: {
      root: {
        color: 'black'
      }
    }
  },
});

export default theme;
