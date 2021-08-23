<template>
    <v-card>
        <v-form
            :disabled="serverRequestInProgress"
            @submit.prevent="saveChanges"
        >
            <v-card-text class="pt-4">
                <v-text-field
                    v-model="newName.value"

                    :error="hasValidationError"
                    :error-messages="validationErrorMessage"
                    label="Ime"
                    maxlength="30"
                    autofocus
                />
            </v-card-text>

            <v-card-actions>
                <v-btn
                    :loading="serverRequestInProgress"
                    color="primary"
                    type="submit"
                    text
                >
                    Spremi
                </v-btn>

                <v-btn
                    color="red"
                    text
                    @click="abandonChanges"
                >
                    Odustani
                </v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script>
import axios from 'axios'

const convertValidationErrorsIntoSingleString = (errorsArray) => Object.values(errorsArray).flat(1).join(' ')

export default {
  name: 'CardItemEditState',

  props: {
    id: {
      type: Number,
      required: true
    },

    name: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      newName: {
        value: this.name,
        validationError: ''
      },
      serverRequestInProgress: false,
      cancelRequestMethod: null
    }
  },

  computed: {
    hasValidationError () {
      return this.newName.validationError !== ''
    },

    validationErrorMessage () {
      return this.newName.validationError
    }
  },

  methods: {
    async saveChanges () {
      this.serverRequestInProgress = true
      this.clearValidationError()

      try {
        await axios.put('/api/card/' + this.id, { name: this.newName.value }, {
          cancelToken: new axios.CancelToken(cancellationCallback => (this.cancelRequestMethod = cancellationCallback))
        })
        this.notifyParentThatEditWasSuccessful()
      } catch (e) {
        if (e.response && e.response.status === 422) { this.newName.validationError = convertValidationErrorsIntoSingleString(e.response.data.errors) }
      } finally {
        this.serverRequestInProgress = false
      }
    },

    cancelRequest () {
      this.cancelRequestMethod !== null && this.cancelRequestMethod()
    },

    clearValidationError () {
      this.newName.validationError = ''
    },

    abandonChanges () {
      this.cancelRequest()
      this.newName = this.name
      this.$emit('cancel')
    },

    notifyParentThatEditWasSuccessful () {
      this.$emit('success', this.newName.value)
    }
  }
}
</script>
