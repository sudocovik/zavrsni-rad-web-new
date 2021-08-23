<template>
    <v-form
        :disabled="serverRequestInProgress"
        @submit.prevent="submitNewCard"
    >
        <v-text-field
            v-model="name.value"

            :error="nameHasValidationErrors"
            :error-messages="nameValidationErrorMessage"
            label="Ime"
            hint="npr. Glavna kartica"
            maxlength="30"
        />

        <v-text-field
            v-model="uid.value"

            :error="uidHasValidationErrors"
            :error-messages="uidValidationErrorMessage"
            label="UID"
            hint="npr. A5-C1-23-13-1C-7E"
            maxlength="40"
        />

        <div class="text-center mt-4">
            <v-btn
                :loading="serverRequestInProgress"
                color="primary"
                type="submit"
            >
                Dodaj
            </v-btn>
        </div>
    </v-form>
</template>

<script>
import axios from 'axios'

const convertValidationErrorsIntoSingleString = (errorsArray) => Object.values(errorsArray).flat(1).join(' ')

export default {
  name: 'CardListNewItemForm',

  data: () => ({
    name: {
      value: '',
      validationError: ''
    },
    uid: {
      value: '',
      validationError: ''
    },
    serverRequestInProgress: false
  }),

  computed: {
    nameHasValidationErrors () {
      return this.name.validationError !== ''
    },
    uidHasValidationErrors () {
      return this.uid.validationError !== ''
    },

    nameValidationErrorMessage () {
      return this.name.validationError
    },
    uidValidationErrorMessage () {
      return this.uid.validationError
    }
  },

  methods: {
    async submitNewCard () {
      this.serverRequestInProgress = true
      this.clearValidationErrors()

      try {
        const { data } = await axios.post('/api/card', {
          name: this.name.value,
          uid: this.uid.value
        })

        const { id, name, uid } = data.data
        this.cardCreated({ id, name, uid })
      } catch (e) {
        if (e.response && e.response.status === 422) {
          const { name = [], uid = [] } = e.response.data.errors

          this.name.validationError = convertValidationErrorsIntoSingleString({ name })
          this.uid.validationError = convertValidationErrorsIntoSingleString({ uid })
        }
      } finally {
        this.serverRequestInProgress = false
      }
    },

    clearValidationErrors () {
      this.name.validationError = ''
      this.uid.validationError = ''
    },

    cardCreated ({ id, name, uid }) {
      this.notifyParentThatNewCardWasCreated(id, name, uid)
      this.resetForm()
    },

    notifyParentThatNewCardWasCreated (id, name, uid) {
      this.$emit('success', { id, name, uid })
    },

    resetForm () {
      this.name.value = ''
      this.uid.value = ''
    }
  }
}
</script>
