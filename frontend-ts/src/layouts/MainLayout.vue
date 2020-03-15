<template>
  <q-layout view="hHh LpR lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-item class="toolbar-left">
            <q-avatar>
              <q-img src="../assets/robot.svg" width="50px" padding></q-img>
            </q-avatar>
            <q-btn dense flat round icon="menu" @click="drawerOpened=!drawerOpened" />
          </q-item>
        </q-toolbar-title>
        <user-control />
      </q-toolbar>
    </q-header>
    <navigation-drawer v-model="drawerOpened"></navigation-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import UserControl from '../components/userControl/userControl.vue'
@Component({
  name: 'Mainlayout',
  data () {
    return {
      options: ['Settings', 'Logout'],
      drawerOpened: true,
      inception: false
    }
  },
  components: { 'user-control': UserControl }
})
export default class MainLayout extends Vue {

}
</script>
<style lang="scss">
.toolbar-left {
  justify-content: space-between;
  align-items: center;
  width: 30%;
}
</style>
