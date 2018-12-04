import React from "react";
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#cce5ff"
    },
    secondary: {
      main: "#f8d7da"
    },
    success: {
      main: "#d4edda"
    },
    danger: { main: "#FF0000" },
    lightGrey: { main: "#e2e3e5" },
    materialBlue: { main: "#2196f3" }
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
