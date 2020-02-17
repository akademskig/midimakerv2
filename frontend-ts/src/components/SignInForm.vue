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
  name = ''
  email = ''
  accept = false
  password = ''
  repeatPassword = ''

  onSubmit () {
    if (!this.$v.$invalid) {
      console.log('submitted!')
    } else if (!this.accept) {
      this.$q.notify(
        { color: 'negative', message: 'Please accept terms and conditions', icon: 'warning', timeout: 2000, position: 'top' }
      )
    }
  }

  onReset () {
    this.$v.$reset()
  }
}
</script>
