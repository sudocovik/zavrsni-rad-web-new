<template>
    <div>
        <CardListNewItem @created="appendNewCard" />

        <template v-if="gotCards">
            <CardItem
                v-for="card in cards"
                :key="card.id"

                :id="card.id"
                :name="card.name"
                :uid="card.uid"
                class="custom-card-item"

                @modified="(newName) => updateCard(card, newName)"
                @deleted="removeCard(card)"
            />
        </template>
        <NoData v-else>
            Nema kartica za otvaranje kutije
        </NoData>
    </div>
</template>

<script>
import NoData from './NoData'
import CardItem from './CardItem'
import CardListNewItem from './CardListNewItem'

export default {
  name: 'CardList',

  components: {
    NoData,
    CardItem,
    CardListNewItem
  },

  props: {
    cards: {
      type: Array,
      required: true
    }
  },

  computed: {
    gotCards () {
      return this.cards.length !== 0
    }
  },

  methods: {
    removeCard (card) {
      this.$emit('card-deleted', card)
    },

    appendNewCard (card) {
      this.$emit('card-created', card)
    },

    updateCard (card, newName) {
      card.name = newName
      this.$emit('card-updated', card)
    }
  }
}
</script>

<style lang="sass" scoped>
.custom-card-item:not(:first-child)
    margin-top: 10px
</style>
