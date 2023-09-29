const path = require("path");

const { app, BrowserWindow, Menu } = require("electron");

const { view } = require("./helpers");

const APP_ENV = "dev";
// const APP_ENV = "prod";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Homie Hon",
    show: false,
  });

  Menu.setApplicationMenu(null);
  mainWindow.loadFile(view("index.html"));
  mainWindow.maximize();
  mainWindow.show();

  // Open the DevTools.
  if (APP_ENV == "dev") mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
