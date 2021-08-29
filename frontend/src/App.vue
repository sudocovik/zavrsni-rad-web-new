<template>
  <DashboardView v-if="false" />
  <LoginView v-else />
</template>

<script>
import DashboardView from '@/views/DashboardView'
import LoginView from '@/views/LoginView'

export default {
  name: 'App',

  components: {
    LoginView,
    DashboardView
  }
}
</script>
