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
        <q-btn-dropdown flat :label="currentUser.username">
          <div class="no-wrap q-pa-none">
            <div class="items-center">
              <q-item class="justify-center" bordered>
                <q-avatar size="72px">
                  <q-img src="../assets/robot-head.svg" width="50px" padding></q-img>
                </q-avatar>
              </q-item>
              <q-separator/>
              <q-list >
                <q-item v-ripple>
                  <q-item-section class="q-px-none" avatar >
                    <q-avatar icon="email" />
                  </q-item-section>

                  <q-item-section>
                    {{currentUser.email}}
                  </q-item-section>
                </q-item>
               <q-item   clickable v-ripple>
                  <q-item-section class="q-px-none" avatar >
                    <q-avatar icon="settings" />
                  </q-item-section>

                  <q-item-section>
                    Settings
                  </q-item-section>
                </q-item>
                   <q-item  clickable v-ripple  @click="logout" >
                  <q-item-section class="q-px-none" avatar >
                    <q-avatar icon="logout" />
                  </q-item-section>

                  <q-item-section>
                    Logout
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-btn-dropdown>
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
  data () {
    return {
      userSelected: null,
      options: ['Settings', 'Logout']
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'Auth/getCurrentUser'
    })
  },
  methods: {
    ...mapActions({
      removeUser: 'Auth/removeUser'
    })
  },
})
export default class MainLayout extends Vue {
  removeUser!: () => void
  logout () {
    this.removeUser()
    this.$router.push('/auth')
  }
}
</script>
