<template>
  <q-dialog :value="inception" @input="$emit('input')">
       <q-card class="q-pa-md ">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="changePassword" label="Change Username"/>
        <q-tab name="changeUsername" label="Change Password"></q-tab>
        <q-tab name="changeEmail" label="Change Email"></q-tab>

      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated class="q-pt-lg">
        <q-tab-panel name="changePassword" class="no-padding">
         <q-card>
        <q-card-section>
        </q-card-section>

        <q-card-section class="q-pt-none">
        </q-card-section>
<!--
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Open another dialog" @click="secondDialog = true" />
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions> -->
      </q-card>
        </q-tab-panel>
        <q-tab-panel name="changeUsername" class="no-padding">
        </q-tab-panel>
            <q-tab-panel name="changeEmail" class="no-padding">
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    </q-dialog>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
  name: 'UserControlModal',
  props: {
    inception: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tab: 'changePassword'
    }
  }
})
export default class UserControlModal extends Vue {

}
</script>

<style>

</style>
