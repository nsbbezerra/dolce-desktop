import React, { useEffect, useState } from "react";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import theme from "./style/theme";
import LayoutApp from "./layout/index";
import { MemoryRouter as Router } from "react-router-dom";

function App() {
  const { setColorMode } = useColorMode();
  const [colorTheme, setColorTheme] = useState("");

  async function admin() {
    const mode = await localStorage.getItem("mode");
    await setColorTheme(mode);
    await setColorMode(mode);
  }

  useEffect(() => {
    admin();
  }, []);

  return (
    <Router>
      <ChakraProvider theme={theme} resetCSS={true}>
        <LayoutApp />
      </ChakraProvider>
    </Router>
  );
}

export default App;
