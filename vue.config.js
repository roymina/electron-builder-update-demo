module.exports = {
  configureWebpack: {
    node: {
      __filename: true,
      __dirname: true
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        productName: "electron_demo",
        appId: "gfwgodie",
        publish: [
          {
            provider: "generic",
            url: "http://127.0.0.1:8080/"
          }
        ],
        win: {
          icon: "build/icons/icon.ico",
          artifactName: "${productName}_setup_${version}.${ext}"
        },
        nsis: {
          oneClick: false,
          perMachine: true,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          runAfterFinish: true,
          installerIcon: "./build/icon.ico",
          uninstallerIcon: "./build/icon.ico"
        }
      }
    }
  }
};
