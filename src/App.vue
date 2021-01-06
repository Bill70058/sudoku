<template>
  <div id="app"
       @click="clearBg">
    <HelloWorld ref="sudoku" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import "@/assets/buttonStyle.scss"
export default {
  name: "App",
  components: {
    HelloWorld
  },
  methods: {
    clearBg() {
      this.$refs.sudoku.clearBg();
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
}
html,
body,
#app {
  padding: 0;
  margin: 0;
}
</style>
