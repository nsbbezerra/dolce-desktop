import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./style/theme";
import LayoutApp from "./layout/index";
import { MemoryRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <ChakraProvider theme={theme} resetCSS={true}>
        <LayoutApp />
      </ChakraProvider>
    </Router>
  );
}

export default App;
