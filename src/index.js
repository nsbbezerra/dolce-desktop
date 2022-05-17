import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ColorModeScript, ColorModeProvider } from "@chakra-ui/react";

ReactDOM.render(
  <React.Fragment>
    <ColorModeProvider options={{ useSystemColorMode: true }}>
      <ColorModeScript initialColorMode={"system"} />
      <App />
    </ColorModeProvider>
  </React.Fragment>,
  document.getElementById("root")
);
