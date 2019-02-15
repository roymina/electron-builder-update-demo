<template>
  <div>
    <div id="nav">
      <button @click="min">最小化</button>
      <button @click="max">最大化</button>
      <button @click="close">关闭</button>
    </div>
    <!-- <router-link to="/">Home</router-link> -->
    {{msg}}
    <!-- <router-view/> -->
    <button @click="notify">桌面通知</button>
  </div>
</template>
<script>
import { ipcRenderer, remote } from "electron";
const notifier = require("node-notifier");
const path = require("path");
export default {
  data() {
    return {
      msg: "未发现新版本"
    };
  },
  created() {
    ipcRenderer.on("message", function(event, text) {
      this.msg = text;
    });
  },
  methods: {
    min() {
      remote.getCurrentWindow().minimize();
    },
    max() {
      remote.getCurrentWindow().maximize();
    },
    close() {
      remote.getCurrentWindow().close();
    },
    notify() {
      // ipcRenderer.send("deskNotify", "hey");
      notifier.notify(
        {
          title: "Whatever title",
          message: "Hey there!",
          icon: path.join(__dirname, "assets", "logo.png"), // Absolute path (doesn't work on balloons)
          sound: true, // Only Notification Center or Windows Toasters
          wait: true // Wait with callback, until user action is taken against notification
        },
        function(err, response) {
          if (err) {
            console.log(`通知错误：${err}`);
          }
          console.log(response);
        }
      );

      notifier.on("click", function(notifierObject, options) {
        console.log("通知被点击");
      });

      notifier.on("timeout", function(notifierObject, options) {
        console.log("通知退出");
      });
    }
  }
};
</script>

<style>
#nav {
  height: 80px;
  background-color: #ccc;
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
#nav button {
  -webkit-app-region: no-drag;
}
</style>


