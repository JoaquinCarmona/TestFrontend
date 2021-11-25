import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-light.css' // This line here

Vue.config.errorHandler = (err, vm, info) => {
  if (process.env.NODE_ENV !== 'production') {
    // Show any error but this one
    if (err.message !== "Cannot read property 'badInput' of undefined") {
      if (err.message !== "Cannot read properties of undefined (reading 'badInput')") {
        console.error(err);
      }
    }
  }
};

Vue.use(VueMaterial)

new Vue({
  el: '#app',
  render: h => h(App)
})

