<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated padding>
      <q-toolbar padding>
        <q-item padding>
        <q-img src="../assets/robot.svg"
        width="50px"
        padding
        ></q-img>
        </q-item>

        <div>
          Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default{
  name: 'MainLayout'
}
</script>

<style lang="scss" scoped>
.q-page-container {
    background: url('../assets/robot-blue.svg') no-repeat center;
    background-size: 40%;
}
</style>
