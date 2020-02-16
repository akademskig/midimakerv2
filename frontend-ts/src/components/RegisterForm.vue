<template>
  <q-form novalidate ref="registerForm" @submit="onSubmit" @reset="onReset" class="q-gutter-sm">
    <q-input
      dense
      outlined
      v-model="name"
      label="Name *"
      hint="Your name"
      lazy-rules
      :rules="[ val => $v.name.required || 'Please type something']"
    />

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
    <q-input
      dense
      outlined
      type="password"
      v-model="repeatPassword"
      label="Repeat Password *"
      lazy-rules
      :rules="[
          val => val === password || 'Psswords are not identical',
        ]"
    />

    <q-toggle class="q-pb-md q-ml-none" v-model="accept" label="I accept the license and terms" />
    <div>
      <q-btn label="Submit" type="submit" color="primary" />
      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
    </div>
  </q-form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { required, email, sameAs } from 'vuelidate/lib/validators'

const validations = {
  name: {
    required: required
  },
  email: {
    required,
    email
  },
  accept: {
    sameAs: sameAs((val) => !!val)
  }
}
@Component({
  name: 'RegisterForm',
  validations: validations
})
export default class RegisterForm extends Vue {
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
