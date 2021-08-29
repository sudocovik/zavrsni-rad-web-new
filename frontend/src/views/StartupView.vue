<template>
  <v-app v-if="fetchingUserInProgress">
    <v-container
      fluid
      class="fill-height"
    >
      <v-row
        no-gutters
        align="center"
        justify="center"
      >
        <v-progress-circular
          color="primary"
          size="80"
          width="8"
          indeterminate
        />
      </v-row>
    </v-container>
  </v-app>
  <div v-else>
    <slot
      v-if="userIsLoggedIn === true"
      name="logged-in"
    />
    <slot
      v-else
      name="logged-out"
      :login="login"
    />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'StartupView',

  data: () => ({
    userIsLoggedIn: null
  }),

  created () {
    axios.get('/api/user')
      .then(() => (this.userIsLoggedIn = true))
      .catch(() => (this.userIsLoggedIn = false))
  },

  computed: {
    fetchingUserInProgress () {
      return this.userIsLoggedIn === null
    }
  },
  methods: {
    login () {
      this.userIsLoggedIn = true
    }
  }
}
</script>
