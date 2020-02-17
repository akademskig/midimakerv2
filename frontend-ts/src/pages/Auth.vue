<template>
  <q-page class="vertical-top justify-evenly">
    <q-card class="q-pa-md card-auth">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="signIn" label="Sign In" :to="'login'" />
        <q-tab name="register" label="Register"></q-tab>
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated class="q-pt-lg">
        <q-tab-panel name="signIn" class="no-padding">
          <signin-form />
        </q-tab-panel>
        <q-tab-panel name="register" class="no-padding">
          <register-form />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import RegisterForm from '../components/RegisterForm.vue'
import SignInForm from '../components/SignInForm.vue'
export default {
  name: 'PageAuth',
  data () {
    return {
      tab: 'signIn'
    }
  },
  components: { 'register-form': RegisterForm, 'signin-form': SignInForm }
}
</script>

<style lang="scss">
.q-card.card-auth {
  width: 96%;
  max-width: 370px;
  padding-left: 28px;
  padding-right: 28px;
  margin: auto;
  top: 18vh;
}
</style>
