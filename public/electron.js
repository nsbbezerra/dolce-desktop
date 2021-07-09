const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;
let slpash;
const Menu = electron.Menu;

Menu.setApplicationMenu(false);

function createWindow() {
  const iconPath = path.resolve(__dirname, "icone.png");
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 700,
    center: true,
    frame: false,
    show: false,
    hasShadow: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      plugins: true,
    },
    icon: iconPath,
  });
  slpash = new BrowserWindow({
    width: 1300,
    height: 700,
    center: true,
    frame: false,
    transparent: true,
    show: true,
    alwaysOnTop: true,
  });
  slpash.loadURL(
    isDev
      ? `file://${path.join(__dirname, "./screen.html")}`
      : `file://${path.join(__dirname, "../build/screen.html")}`
  );
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.once("ready-to-show", () => {
    slpash.destroy();
    mainWindow.show();
  });
  mainWindow.on("closed", () => (mainWindow = null));
}
app.setName("NKGEST - Gerenciador de Ecomerce");
app.allowRendererProcessReuse = true;
app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
