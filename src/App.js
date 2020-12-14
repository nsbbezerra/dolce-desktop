import React, { useEffect, useState } from "react";
import { Button, ChakraProvider, useColorMode } from "@chakra-ui/react";
import theme from "./style/theme";

function App() {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();
  const [colorTheme, setColorTheme] = useState("");

  async function setColor() {
    const mode = await localStorage.getItem("mode");
    if (mode === "light") {
      setColorMode("dark");
      await localStorage.setItem("mode", "dark");
    } else {
      setColorMode("light");
      await localStorage.setItem("mode", "light");
    }
  }

  async function admin() {
    const mode = await localStorage.getItem("mode");
    await setColorTheme(mode);
    await setColorMode(mode);
  }

  useEffect(() => {
    admin();
  }, []);

  return (
    <ChakraProvider theme={theme} resetCSS={true}>
      <h1>Dolce Desktop</h1>
      {colorTheme}
      <Button onClick={() => setColor()}>Mudar</Button>
    </ChakraProvider>
  );
}

export default App;
