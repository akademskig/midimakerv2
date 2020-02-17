<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated padding>
      <q-toolbar padding>
        <q-item>
          <q-avatar>
            <q-img src="../assets/robot.svg" width="50px" padding></q-img>
          </q-avatar>
        </q-item>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style lang="scss" scoped>
.q-page {
  background: url("../assets/robot-blue.svg") no-repeat center;
  background-size: 30%;
}
</style>
