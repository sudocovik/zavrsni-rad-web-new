<template>
    <v-app style="background-color: #eee;">
        <v-container
            fluid
            class="fill-height"
        >
            <v-row
                align="center"
                justify="center"
            >
                <v-col
                    cols="12"
                    md="6"
                    lg="3"
                >
                    <v-card elevation="6">
                        <v-toolbar
                            color="primary"
                            flat
                        >
                            <span class="white--text text-h6">Prijava</span>
                        </v-toolbar>

                        <v-card-text>
                            <LoginForm
                                @success="redirectToDashboard"
                                @error:wrong-credentials="notifyUserCredentialsAreWrong"
                            />
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <TheErrorMessage :message.sync="errorMessage" />
    </v-app>
</template>

<script>
import LoginForm from '@/components/LoginForm'
import TheErrorMessage from '@/components/TheErrorMessage'

export default {
  name: 'LoginView',

  components: {
    LoginForm,
    TheErrorMessage
  },

  data: () => ({
    errorMessage: ''
  }),

  methods: {
    showErrorMessage (message) {
      this.errorMessage = message
    },

    redirectToDashboard () {
      this.letParentHandleRedirection()
    },

    letParentHandleRedirection () {
      this.$emit('logged-in')
    },

    notifyUserCredentialsAreWrong () {
      this.showErrorMessage('Korisničko ime i/ili lozinka su ne ispravni.')
    }
  }
}
</script>
