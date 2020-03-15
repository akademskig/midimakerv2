<template>
  <q-input v-model="value" @input="$emit('input')"></q-input>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'CInput'
})
export default class CInput extends Vue {
}
</script>

<style>

</style>
