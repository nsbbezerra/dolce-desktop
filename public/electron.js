const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;
const Menu = electron.Menu;

Menu.setApplicationMenu(false);

function createWindow() {
  const iconPath = path.resolve(__dirname, "icone512.png");
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 700,
    center: true,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: iconPath,
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.webContents.openDevTools();
}

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
