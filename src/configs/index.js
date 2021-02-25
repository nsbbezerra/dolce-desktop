const destakColor = localStorage.getItem("destak");
const destak = !destakColor ? "blue" : destakColor;

const config = {
  primary:
    (destak === "gray" && "#A0AEC0") ||
    (destak === "red" && "#F56565") ||
    (destak === "orange" && "#ED8936") ||
    (destak === "yellow" && "#ECC94B") ||
    (destak === "green" && "#48BB78") ||
    (destak === "teal" && "##38B2AC") ||
    (destak === "blue" && "#4299E1") ||
    (destak === "cyan" && "#0BC5EA") ||
    (destak === "purple" && "#9F7AEA") ||
    (destak === "pink" && "#ED64A6"),
  header: {
    bg: `${destak}.500`,
    color: "gray.900",
  },
  sider: {
    colorBtn: destak,
    light: `${destak}.100`,
    dark: `${destak}.400`,
    btnHome: destak,
  },
  inputs: `${destak}.400`,
  switchs: destak,
  buttons: destak,
  tabs: destak,
  headerapp: {
    dark: "gray.700",
    light: "gray.100",
  },
  print: {
    bg: `${destak}.200`,
    color: `${destak}.800`,
    border: `${destak}.200`,
  },
};

export default config;
