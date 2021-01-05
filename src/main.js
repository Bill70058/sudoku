import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Array.prototype.equar = function (a = [], b = []) {
  if (a.length !== b.length) {
    return false
  } else {
    if (a.length !== 0 && b.length !== 0) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (a[i][j] != b[i][j])
            return false
        }
      }
    } else {
      return 'a or b length = 0'
    }
  }
  return true
}

new Vue({
  render: h => h(App)
}).$mount("#app");