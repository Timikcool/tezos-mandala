import React from "react";
import ReactDOM from "react-dom";
import App from "./App.tsx";
import * as serviceWorker from "./serviceWorker";
import { ChakraProvider } from "@chakra-ui/react";

// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react";
import { AppProvider } from "./state/app";
// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        background: " #ffffff",
        border: "none",
        boxShadow: "4px 4px 8px #d9d9d9, -4px -4px 8px #ffffff",
        _hover: {
          boxShadow: "8px 8px 16px #d9d9d9, -8px -8px 16px #ffffff",
        },
        _focus: {
          boxShadow: "2px 2px 4px #d9d9d9, -2px -2px 4px #ffffff",
        },
      },

      variants: {
        "mandala-card": {
          boxShadow: "none",
          background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
          _hover: {
            boxShadow: "10px 10px 20px #d9d9d9, -10px -10px 20px #ffffff",
          },
          _focus: {
            boxShadow: "none",
          },
        },
      },
    },
    Tab: {
      variants: {
        rarity: {
          borderTop: "2px solid",
        },
      },
    },
  },
  colors: {
    text: { 500: "#14213D" },
    orange: { 500: "#FCA311" },
    "orange-tabs": {
      600: "#FCA311",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </AppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
