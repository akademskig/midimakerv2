import axios, { AxiosStatic } from 'axios'
import Vue, { PluginFunction } from 'vue'
import Vuelidate from 'vuelidate'
import NavigationDrawer from '../components/drawers/navigationDrawer.vue'
declare module 'vue/types/vue' {
  interface Vue {
    use: (module: PluginFunction<any> | AxiosStatic) => void;
  }
}

export default ({ Vue }: { Vue: Vue }) => {
  Vue.use(axios)
  Vue.use(Vuelidate)
}


Vue.component('navigation-drawer', NavigationDrawer)