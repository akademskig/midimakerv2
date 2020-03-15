<template>
  <q-btn-dropdown flat :label="currentUser.username">
    <div class="no-wrap q-pa-none">
      <div class="items-center">
        <q-item class="justify-center" bordered>
          <q-avatar size="72px">
            <q-img src="../../assets/robot-head.svg" width="50px" padding></q-img>
          </q-avatar>
        </q-item>
        <q-separator />
        <q-list>
          <q-item v-ripple>
            <q-item-section class="q-px-none" avatar>
              <q-avatar icon="email" />
            </q-item-section>

            <q-item-section>{{currentUser.email}}</q-item-section>
          </q-item>
          <q-item clickable v-ripple  @click="inception = true">
            <q-item-section class="q-px-none" avatar >
              <q-avatar icon="settings" />
            </q-item-section>

            <q-item-section >Settings</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="logout">
            <q-item-section class="q-px-none" avatar>
              <q-avatar icon="logout" />
            </q-item-section>

            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
         <user-control-modal :inception="inception" @input="toggleDialog()"/>

      </div>
    </div>
  </q-btn-dropdown>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex'
import Component from 'vue-class-component'
import Vue from 'vue'

@Component({
  name: 'UserControl',
  data () {
    return {
      inception: false
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
    }),
    toggleDialog () {
      this.inception = !this.inception
    }
  }
})
export default class UserControl extends Vue {
  removeUser!: () => void
  logout () {
    this.removeUser()
    this.$router.push('/auth')
  }
}
</script>
