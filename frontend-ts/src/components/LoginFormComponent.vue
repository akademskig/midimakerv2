<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form novalidate ref="loginForm" @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="name"
        label="Name *"
        hint="Your name"
        lazy-rules
        :rules="[ val => $v.name.required || 'Please type something']"
      />

      <q-input
        filled
        type="email"
        v-model="email"
        label="Email *"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Email is required',
          val => $v.email.email || 'Email is not valid'
        ]"
      />

      <q-toggle v-model="accept" label="I accept the license and terms"
      :rules="[
      val=> val ||'Please accept license and terms.'
      ]" />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { required, email } from 'vuelidate/lib/validators'

const validations = {
  name: {
    required: required
  },
  email: {
    required,
    email
  },
  accept: {
    required
  }
}
@Component({
  name: 'LoginForm',
  validations: validations
})
export default class LoginForm extends Vue {
  name = ''
  email = ''
  accept = false
  password = ''
  repeatPassword = ''

  onSubmit () {
    console.log('form submitted!')
    console.log()
  }

  onReset () {
    console.log(this.$v)
    console.log('form resetted')
  }
}
</script>
