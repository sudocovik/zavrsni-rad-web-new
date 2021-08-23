<template>
    <v-dialog max-width="400">
        <template v-slot:activator="{ on, attrs }">
            <v-fab-transition>
                <v-btn
                    color="green darken-2"
                    elevation="2"
                    fab
                    large
                    fixed
                    bottom
                    right
                    v-show="componentMounted"
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon color="white">mdi-plus</v-icon>
                </v-btn>
            </v-fab-transition>
        </template>

        <template v-slot:default="dialog">
            <v-card>
                <v-card-title>Nova kartica</v-card-title>
                <v-card-text>
                    <CardListNewItemForm @success="(card) => { newCardWasCreated(card); dialog.value = false }" />
                </v-card-text>
            </v-card>

        </template>
    </v-dialog>
</template>

<script>
import CardListNewItemForm from './CardListNewItemForm'

export default {
  name: 'CardListNewItem',

  components: {
    CardListNewItemForm
  },

  data: () => ({
    componentMounted: false
  }),

  mounted () {
    this.componentMounted = true
  },

  methods: {
    newCardWasCreated (card) {
      this.notifyParentThatNewCardWasCreated(card)
    },

    notifyParentThatNewCardWasCreated (card) {
      this.$emit('created', card)
    }
  }
}
</script>
