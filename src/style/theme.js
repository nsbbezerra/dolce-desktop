import { theme, extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  ...theme,
  useSystemColorMode: false,
  initialColorMode: "light",
  fonts: {
    body: "Roboto, system-ui, sans-serif",
    heading: "Acme, sans-serif",
    mono: "Menlo, monospaced",
  },
  fontWeights: {
    ...theme.fontWeights,
    normal: 400,
    medium: 500,
    bold: 700,
  },
  radii: {
    ...theme.radii,
    sm: "3px",
    md: "5px",
  },
  colors: {
    ...theme.colors,
    yellow: {
      ...theme.colors.yellow,
    },
    gray: {
      ...theme.colors.gray,
    },
    red: {
      ...theme.colors.red,
    },
    pink: {
      ...theme.colors.pink,
    },
    green: {
      ...theme.colors.green,
    },
  },
});

export default customTheme;
