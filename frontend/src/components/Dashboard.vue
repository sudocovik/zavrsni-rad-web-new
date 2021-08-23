<template>
  <v-container
    class="fill-height align-start"
  >
    <CardListData>
      <template v-slot:default="{ cards, addCard, removeCard, updateCard }">
        <v-row>
          <v-col cols="12" md="8">
            <AccessLog :cards="cards" />
          </v-col>

          <v-col cols="12" md="4">
            <CardList
              :cards="cards"
              @card-created="addCard"
              @card-deleted="removeCard"
              @card-updated="updateCard"
            />
          </v-col>
        </v-row>
      </template>
    </CardListData>
  </v-container>
</template>

<script>
import CardList from './CardList'
import AccessLog from './AccessLog'
import CardListData from './CardListData'

export default {
  name: 'Dashboard',

  components: {
    CardListData,
    CardList,
    AccessLog
  }
}
</script>
