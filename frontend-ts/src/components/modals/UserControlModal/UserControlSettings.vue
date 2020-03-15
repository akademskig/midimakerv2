<template>
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
            <q-form>
            <c-input></c-input>

                <q-form>
        </q-card-section>
      </q-card>
        </q-tab-panel>
        <q-tab-panel name="changeUsername" class="no-padding">
        </q-tab-panel>
            <q-tab-panel name="changeEmail" class="no-padding">
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
  name: 'UserControlSettings',
  data () {
    return {
      tab: 'changePassword'
    }
  }
})
export default class UserControlSettings extends Vue {

}
</script>

<style>

</style>
