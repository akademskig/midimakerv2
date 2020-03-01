<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
           <q-item>
          <q-avatar>
            <q-img src="../assets/robot.svg" width="50px" padding></q-img>
          </q-avatar>
        </q-item>
        </q-toolbar-title>
        <q-avatar>
            <q-img src="../assets/robot-head.svg" width="50px" padding></q-img>
          </q-avatar>
          <q-item class="items-center">{{currentUser && currentUser.username}}</q-item>
          <q-item  class="items-center">
            <q-btn icon-right="logout" label="Logout" flat @click="logout()">
            </q-btn>

          </q-item>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters, mapActions } from 'vuex'
@Component({
  name: 'Mainlayout',
  computed: {
    ...mapGetters({
      currentUser: 'Auth/getCurrentUser'
    })
  },
  methods: {
    ...mapActions({
      removeUser: 'Auth/removeUser'
    }),
    logout () {
      this.removeUser()
      this.$router.push('/auth')
    }
  }
})
export default class MainLayout extends Vue {
}
</script>
