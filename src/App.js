import React from "react";
import { Button, ChakraProvider, useColorMode } from "@chakra-ui/react";
import theme from "./style/theme";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <ChakraProvider theme={theme} resetCSS={true}>
      <h1>Dolce Desktop</h1>
      {colorMode}
      <Button onClick={toggleColorMode}>Mudar</Button>
    </ChakraProvider>
  );
}

export default App;
