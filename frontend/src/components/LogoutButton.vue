<template>
    <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="white"
                icon
                v-bind="attrs"
                v-on="on"
                @click="logout"
            >
                <v-icon>mdi-power</v-icon>
            </v-btn>
        </template>

        <span>Odjava</span>
    </v-tooltip>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LogoutButton',

  methods: {
    async logout () {
      await axios.get('/api/logout')

      window.location.reload()
    }
  }
}
</script>
