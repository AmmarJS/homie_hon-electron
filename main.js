const path = require("path");
const fs = require("fs")

const { app, BrowserWindow, Menu, ipcMain } = require("electron");
if (require('electron-squirrel-startup')) app.quit();

const { view } = require("./helpers");
const { getTodayRecords, getSpecificDayRecords, getSpecificMonthRecords, insertRecord, deleteRecord ,getSettings, changeSettings } = require("./models/db")

// const APP_ENV = "dev";
const APP_ENV = "prod";

const VERSION = "1.0.0"

const ACCOUNT = {
  username: "nazem",
  password: "0011002200"
}

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: `Homie Hon - v${VERSION}`,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, "images/1024x1024.png"),
  });

  ipcMain.handle('insert-record', async (event, record) => {
    await insertRecord(record)
  })

  ipcMain.on('edit-options', (event, options) => {
    changeSettings(options)
  })

  // ipcMain.on("export-db", (event) => {
  //   mainWindow.webContents.downloadURL(`file://${__dirname}/models/database.db`)
  // })

  // ipcMain.on("import-db", (event, file) => {
  //   fs.copyFile(file, "./models/database.db")
  // })

  // ipcMain.on("export-db", (event) => {
  //   mainWindow.webContents.downloadURL(`file://${__dirname}/models/database.db`)
  // })

  ipcMain.handle('get-options', async (event) => {
    const settings = await getSettings()
    return {
      "hour": settings[0].value,
      "ceil": settings[1].value
    }
  })

  ipcMain.handle('get-today-records', async (event) => {
    const records = await getTodayRecords()
    return records
  })

  ipcMain.handle('get-day-records', async (event, date) => {
    const records = await getSpecificDayRecords(date)
    return records
  })

  ipcMain.handle("delete-record", async (event, id) => {
    deleteRecord(id)
  })

  ipcMain.handle("get-version", async (event) => {
    return VERSION
  })

  ipcMain.handle('login', async (event, credentials) => {
    if(credentials.username == ACCOUNT.username && credentials.password == ACCOUNT.password) {
      mainWindow.loadFile(view("index.html"));
    } else {
      return "المعلومات المدخلة غير صحيحة حاول مجدداً";
    }
  })

  ipcMain.on('quit', (event) => {
    app.quit()
  })

  Menu.setApplicationMenu(null);
  if(APP_ENV == "dev") {
    mainWindow.loadFile(view("index.html"));
  } else {
    mainWindow.loadFile(view("login.html"));
  }
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