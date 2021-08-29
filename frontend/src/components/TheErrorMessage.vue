<template>
    <v-snackbar
        :value="visible"

        app
        bottom
        timeout="3000"
        @input="clearMessageIfSnackbarIsHidden"
    >
        {{ message }}
    </v-snackbar>
</template>

<script>
export default {
  name: 'TheErrorMessage',

  props: {
    message: {
      type: String,
      required: true
    }
  },

  data: () => ({
    visible: false
  }),

  watch: {
    message () {
      this.showSnackbarIfMessageIsNotEmpty()
    }
  },

  methods: {
    clearMessage () {
      this.$emit('update:message', '')
    },

    showSnackbarIfMessageIsNotEmpty () {
      this.visible = this.message !== ''
    },

    clearMessageIfSnackbarIsHidden (value) {
      if (!value) this.clearMessage()
    }
  }
}
</script>
