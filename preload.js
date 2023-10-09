const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  addRecord: (record) => ipcRenderer.invoke('insert-record', record),
  getTodayRecords: () => ipcRenderer.invoke("get-today-records"),
  getSpecificDayRecords: (date) => ipcRenderer.invoke("get-day-records", date),
  deleteRecord: (id) => ipcRenderer.invoke("delete-record", id),
  editOptions: (options) => ipcRenderer.send('edit-options', options),
  getOptions: () => ipcRenderer.invoke("get-options"),
  // exportDB: () => ipcRenderer.send("export-db"),
  // importDB: (file) => ipcRenderer.send("import-db"),
  getVersion: () => ipcRenderer.invoke("get-version"),
  quit: () => ipcRenderer.send('quit')
});

contextBridge.exposeInMainWorld("loginAPI", {
  login: (credentials) => ipcRenderer.invoke("login", credentials)
})