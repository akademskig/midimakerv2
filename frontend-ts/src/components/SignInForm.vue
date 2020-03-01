<template>
  <q-form novalidate ref="logInForm" @submit="onSubmit" @reset="onReset" class="q-gutter-sm">
    <q-input
      dense
      outlined
      type="email"
      v-model="email"
      label="Email *"
      lazy-rules
      :rules="[
          val => val !== null && val !== '' || 'Email is required',
          val => $v.email.email || 'Email is not valid'
        ]"
    />
    <q-input
      dense
      outlined
      type="password"
      v-model="password"
      label="Password *"
      lazy-rules
      :rules="[
          val => val !== null && val !== '' || 'Email is required',
          val => $v.email.email || 'Email is not valid'
        ]"
    />
    <div>
      <q-btn label="Submit" type="submit" color="primary" />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { required, email } from 'vuelidate/lib/validators'
import e from '../helpers/errors'
const validations = {
  email: {
    required,
    email
  },
  password: {
    required
  }
}
@Component({
  name: 'signInForm',
  validations: validations
})
export default class SignInForm extends Vue {
  email = ''
  password = ''

  onSubmit () {
    if (!this.$v.$invalid) {
      this.$store.dispatch('Auth/signIn',
        { email: this.email, password: this.password })
        .then(username => {
          console.log(username)
          this.$q.notify({ message: `Welcome ${username}!`, type: 'positive', timeout: 2000, position: 'top' })
          this.$router.push('/')
        }

        )
        .catch(err =>
          this.$q.notify(
            { caption: `\n${e.parseError(err).message}`, html: true, color: 'negative', message: 'Sign in error!', icon: 'warning', timeout: 2000, position: 'top' }
          ))
    }
  }

  onReset () {
    this.$v.$reset()
  }
}
</script>
