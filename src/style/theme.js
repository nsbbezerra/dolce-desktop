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
  components: {
    Button: {
      baseStyle: { _focus: { boxShadow: "none" } },
    },
    CloseButton: {
      baseStyle: { _focus: { boxShadow: "none" } },
    },
    Tabs: {
      baseStyle: { tab: { _focus: { boxShadow: "none" } } },
    },
    Menu: {
      baseStyle: {
        list: {
          boxShadow: "lg",
        },
      },
    },
    Popover: {
      baseStyle: {
        content: { boxShadow: "lg" },
      },
    },
  },
});

export default customTheme;
