import axios from 'axios'
import Vue from 'vue'
import Vuelidate from 'vuelidate'

declare module 'vue/types/vue' {
  interface Vue {
    use: (module: any) => void;
  }
}

export default ({ Vue }: { Vue: Vue }) => {
  Vue.use(axios)
  Vue.use(Vuelidate)
}
