import React from "react";
import { Button, ChakraProvider } from "@chakra-ui/react";
import theme from "./style/theme";

function App() {
  return (
    <ChakraProvider theme={theme} resetCSS={true}>
      <h1>Dolce Desktop</h1>
    </ChakraProvider>
  );
}

export default App;
