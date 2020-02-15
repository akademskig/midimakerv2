<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
  </q-page>
</template>

<script lang="ts">
import ExampleComponent from 'components/ClassComponent.vue'

export default {
  name: 'PageIndex',
  components: { ExampleComponent },
}
</script>
