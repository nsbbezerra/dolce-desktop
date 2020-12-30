import React, { useEffect, useState } from "react";
import { Button, ChakraProvider, useColorMode } from "@chakra-ui/react";
import theme from "./style/theme";
import LayoutApp from "./layout/index";

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
      <LayoutApp />
    </ChakraProvider>
  );
}

export default App;
