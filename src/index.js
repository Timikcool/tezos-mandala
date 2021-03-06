import React from "react";
import ReactDOM from "react-dom";
import App from "./App.tsx";
import * as serviceWorker from "./serviceWorker";
import { ChakraProvider } from "@chakra-ui/react";

// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react";
// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  colors: {
    text: { 500: "#14213D" },
    orange: { 500: "#FCA311" },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
