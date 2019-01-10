import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#d4edda" //success
    },
    secondary: {
      main: "#cce5ff" //materialBlue
    },
    danger: {
      backgroundColor: "#f8d7da" //danger
    },
    info: {
      backgroundColor: "#d1ecf1"
    },
    warning: {
      backgroundColor: "#fff3cd"
    }
  },
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiTableCell: {
      root: {
        textAlign: "center"
      }
    }
  }
});

export default theme;
