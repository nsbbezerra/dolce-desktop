import { theme, extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  ...theme,

  fonts: {
    body: "Roboto Condensed, system-ui, sans-serif",
    heading: "Roboto, system-ui, sans-serif",
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
      400: "#D4AF37",
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
