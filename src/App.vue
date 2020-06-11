<template>
  <router-view />
</template>

<script>
// import Menu from './pages/Menu'

export default {
  name: "App",
  components: {
    // Menu,
  },
  mounted() {
    // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
            window.onbeforeunload = function () {
                var storage = window.localStorage;
                storage.clear()
            }
  }
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
