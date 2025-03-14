import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6D8821",
    },
    secondary: {
      main: "#660D17",
    },
    background: {
      default: "#F5F5F5",
      paper: "#EDEDED",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#333333",
    },
  },
  typography: {
    fontFamily: `"Plus Jakarta Sans", "Roboto", "Arial", sans-serif`,
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      color: "#FFFFFF",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#FFFFFF",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      color: "#FFFFFF",
    },
    button: {
      textTransform: "uppercase",
      fontWeight: "bold",
      fontSize: "16px",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          padding: "12px 30px",
          fontWeight: "bold",
          "&:hover": {
            opacity: 0.9,
          },
        },
        containedPrimary: {
          backgroundColor: "#6D8821",
          "&:hover": {
            backgroundColor: "#5a751c",
          },
        },
        containedSecondary: {
          backgroundColor: "#660D17",
          "&:hover": {
            backgroundColor: "#520A13",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "white",
        },
      },
    },
  },
});

export default theme;
