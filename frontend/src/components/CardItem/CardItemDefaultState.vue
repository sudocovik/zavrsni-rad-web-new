<template>
    <v-hover
        v-slot:default="{ hover }"
        open-delay="300"
    >
        <v-card>
            <div class="d-flex align-center pr-4">
                <div class="flex">
                    <v-card-title>{{ name }}</v-card-title>
                    <v-card-subtitle v-html="uidFormatted"></v-card-subtitle>
                </div>
                <div>
                    <v-icon>mdi-credit-card-outline</v-icon>
                </div>
            </div>
            <v-fade-transition>
                <v-card-actions v-show="hover">
                    <v-btn
                        color="primary"
                        text
                        @click="notifyParentThatEditModeIsRequested"
                    >
                        <v-icon left>mdi-pencil</v-icon>
                        <span>Uredi</span>
                    </v-btn>

                    <v-btn
                        color="red"
                        text
                        @click="notifyParentThatDeleteModeIsRequested"
                    >
                        <v-icon left>mdi-delete</v-icon>
                        <span>Obriši</span>
                    </v-btn>
                </v-card-actions>
            </v-fade-transition>
        </v-card>
    </v-hover>
</template>

<script>
export default {
  name: 'CardItemDefaultState',

  props: {
    name: {
      type: String,
      required: true
    },

    uid: {
      type: String,
      required: true
    }
  },

  computed: {
    uidFormatted () {
      return this.uid.replaceAll('-', '<span class="uid-separator">-</span>')
    }
  },

  methods: {
    notifyParentThatEditModeIsRequested () {
      this.$emit('edit-requested')
    },

    notifyParentThatDeleteModeIsRequested () {
      this.$emit('delete-requested')
    }
  }
}
</script>

<style lang="sass">
.uid-separator
    padding: 0 2px
</style>
