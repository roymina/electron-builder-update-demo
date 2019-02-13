<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      {{msg}}
    </div>
    <router-view/>
  </div>
</template>
<script>
import { ipcRenderer } from "electron";
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
  }
};
</script>


