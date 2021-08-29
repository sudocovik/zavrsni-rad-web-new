<template>
    <v-form @submit.prevent="login">
        <v-text-field
            v-model="username.value"
            :error-messages="username.errorMessages"

            label="Korisničko ime"
            prepend-inner-icon="mdi-account"
            outlined
        />

        <v-text-field
            v-model="password.value"
            :error-messages="password.errorMessages"

            type="password"
            label="Lozinka"
            prepend-inner-icon="mdi-lock"
            outlined
        />

        <v-btn
            color="primary"
            type="submit"
            block
            outlined
        >
            Pošalji
        </v-btn>
    </v-form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginForm',

  data: () => ({
    username: {
      value: '',
      errorMessages: []
    },
    password: {
      value: '',
      errorMessages: []
    },
    loading: false
  }),

  methods: {
    async login () {
      this.loading = true
      this.clearValidationErrorMessages()

      try {
        const { data } = await axios.post('/api/login', { username: this.username.value, password: this.password.value })
        const serverResponse = data.data

        this.loginSuccessful(serverResponse)
      } catch (e) {
        if (e.response.status === 422) {
          const errors = e.response.data.errors
          const {
            username: usernameErrors = [],
            password: passwordErrors = []
          } = errors

          this.username.errorMessages = usernameErrors
          this.password.errorMessages = passwordErrors
        } else if (e.response.status === 401) {
          this.handleWrongCredentialsException()
        }

        this.loading = false
      }
    },

    clearValidationErrorMessages () {
      this.username.errorMessages = []
      this.password.errorMessages = []
    },

    loginSuccessful (messageForUser) {
      this.$emit('success', messageForUser)
    },

    handleWrongCredentialsException () {
      this.$emit('error:wrong-credentials')
    }
  }
}
</script>
