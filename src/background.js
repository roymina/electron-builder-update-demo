"use strict";

import { app, protocol, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import { autoUpdater } from "electron-updater";
const path = require("path");
//const notifier = require("node-notifier");

import {
  createProtocol,
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";

const trayMenuItems = [
  {
    label: "Empty Application",
    enabled: false
  },

  {
    label: "Settings",
    click: function() {
      console.log("Clicked on settings");
    }
  },

  {
    label: "Help",
    click: function() {
      console.log("Clicked on Help");
    }
  }
];

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(["app"], { secure: true });
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, frame: false });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });
  //系统托盘
  setTray();
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools();
  } else {
    //检查更新
    autoUpdater.checkForUpdates();
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

/**-----------------system tray ------------------*/

function setTray() {
  const iconPath = path.join("", "public", "icon.png");
  console.log(iconPath);
  //sel tray
  let tray = new Tray(iconPath);
  let trayMenu = Menu.buildFromTemplate(trayMenuItems);
  tray.setToolTip("HouHouHou");
  tray.setContextMenu(trayMenu);
}
// ipcMain.on("deskNotify", (event, arg) => {
//   console.log(arg); // prints "ping"
//   notifier.notify(
//     {
//       title: "My awesome title",
//       message: arg,
//       sound: true, // Only Notification Center or Windows Toasters
//       wait: true // Wait with callback, until user action is taken against notification
//     },
//     function(err, response) {
//       // Response is response from notification
//     }
//   );
// });
/*------auto-updater------------*/

//向主窗口发送文本
function sendStatusToWindow(text) {
  console.log(text);
  win.webContents.send("message", text);
}
autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (ev, info) => {
  sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", (ev, info) => {
  sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (ev, err) => {
  sendStatusToWindow("Error in auto-updater.");
});
autoUpdater.on("download-progress", (ev, progressObj) => {
  sendStatusToWindow("Download progress...");
});

autoUpdater.on("update-downloaded", (ev, info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  sendStatusToWindow("Update downloaded; will install in 5 seconds");
  setTimeout(function() {
    autoUpdater.quitAndInstall();
  }, 5000);
});
