<script>
import axios from 'axios'

export default {
  name: 'CardListData',

  data: () => ({
    cards: []
  }),

  created () {
    this.fetchCards()
  },

  methods: {
    async fetchCards () {
      const { data } = await axios.get('/api/card')
      this.cards = data.data
    },

    removeCard (cardForRemoval) {
      this.cards = this.cards.filter(card => card.id !== cardForRemoval.id)
    },

    appendCard (card) {
      this.cards.push(card)
    },

    updateCard (cardUnderUpdate) {
      const cardPosition = this.cards.findIndex(card => card.id === cardUnderUpdate.id)

      if (cardPosition !== -1) this.cards[cardPosition] = cardUnderUpdate
    }
  },

  render () {
    return this.$scopedSlots.default({
      cards: this.cards,
      removeCard: this.removeCard,
      addCard: this.appendCard,
      updateCard: this.updateCard
    })
  }
}
</script>
