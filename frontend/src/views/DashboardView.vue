<template>
  <v-app style="background-color: #eee;">
    <v-app-bar
      app
      color="primary"
    >
      <span class="white--text text-h6">Kutija</span>

      <v-spacer />

      <LogoutButton />
    </v-app-bar>
    <v-main>
      <Dashboard />
    </v-main>
  </v-app>
</template>

<script>
import Dashboard from '@/components/Dashboard'
import LogoutButton from '@/components/LogoutButton'

export default {
  name: 'DashboardView',

  components: {
    Dashboard,
    LogoutButton
  }
}
</script>
