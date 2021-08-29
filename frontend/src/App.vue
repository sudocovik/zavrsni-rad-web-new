<template>
  <StartupView>
    <DashboardView v-if="false" />
    <LoginView v-else-if="false" />
  </StartupView>
</template>

<script>
import StartupView from '@/views/StartupView'
import DashboardView from '@/views/DashboardView'
import LoginView from '@/views/LoginView'

export default {
  name: 'App',

  components: {
    StartupView,
    LoginView,
    DashboardView
  }
}
</script>
