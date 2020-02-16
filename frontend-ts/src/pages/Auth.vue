<template>
  <q-page class="row items-center justify-evenly">
    <login-form/>
  </q-page>

</template>

<script lang="ts">
import LoginForm from '../components/LoginFormComponent.vue'

export default {
  name: 'PageLogin',
  components: { 'login-form': LoginForm }
}
</script>
