<template>
  <StartupView>
    <template #logged-in>
      <DashboardView />
    </template>

    <template #logged-out="{ login: redirectToDashboard }">
      <LoginView @logged-in="redirectToDashboard" />
    </template>
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
