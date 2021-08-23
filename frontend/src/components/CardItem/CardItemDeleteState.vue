<template>
    <v-card>
        <v-card-text>Obrisati karticu <b>{{ name }}</b>?</v-card-text>
        <v-card-actions>
            <v-btn
                :disabled="serverRequestInProgress"
                :loading="serverRequestInProgress"
                color="primary"
                type="submit"
                text
                @click="performDeletion"
            >
                Obriši
            </v-btn>

            <v-btn
                color="red"
                text
                @click="abandonDeletion"
            >
                Odustani
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CardItemDeleteState',

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

  data: () => ({
    serverRequestInProgress: false,
    cancelRequestMethod: null
  }),

  methods: {
    async performDeletion () {
      this.serverRequestInProgress = true

      try {
        await axios.delete('/api/card/' + this.id, {
          cancelToken: new axios.CancelToken(cancellationCallback => (this.cancelRequestMethod = cancellationCallback))
        })
        this.notifyParentThatDeletionWasSuccessful()
      } catch (e) {
        console.dir(e) // TODO error handling
      } finally {
        this.serverRequestInProgress = false
      }
    },

    cancelRequest () {
      this.cancelRequestMethod !== null && this.cancelRequestMethod()
    },

    notifyParentThatDeletionWasSuccessful () {
      this.$emit('success')
    },

    abandonDeletion () {
      this.cancelRequest()
      this.notifyParentThatDeletionWasCanceled()
    },

    notifyParentThatDeletionWasCanceled () {
      this.$emit('cancel')
    }
  }
}
</script>
