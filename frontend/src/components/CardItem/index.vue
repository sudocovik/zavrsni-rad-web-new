<template>
    <CardItemEditState
        v-if="inEditMode"

        :id="id"
        :name="name"

        @cancel="stopEdit"
        @success="completeEdit"
    />
    <CardItemDeleteState
        v-else-if="inDeleteMode"

        :id="id"
        :name="name"

        @cancel="stopDelete"
        @success="completeDelete"
    />
    <CardItemDefaultState
        v-else

        :name="name"
        :uid="uid"

        @edit-requested="startEdit"
        @delete-requested="startDelete"
    />
</template>

<script>
import CardItemDefaultState from './CardItemDefaultState'
import CardItemEditState from './CardItemEditState'
import CardItemDeleteState from './CardItemDeleteState'

export default {
  name: 'CardItem',

  components: {
    CardItemDefaultState,
    CardItemEditState,
    CardItemDeleteState
  },

  props: {
    id: {
      type: Number,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    uid: {
      type: String,
      required: true
    }
  },

  data: () => ({
    editActive: false,
    deleteActive: false
  }),

  computed: {
    inEditMode () {
      return this.editActive === true
    },

    inDeleteMode () {
      return this.deleteActive === true
    }
  },

  methods: {
    startEdit () {
      this.editActive = true
    },

    stopEdit () {
      this.editActive = false
    },

    completeEdit (newName) {
      this.$emit('modified', newName)
      this.stopEdit()
    },

    startDelete () {
      this.deleteActive = true
    },

    stopDelete () {
      this.deleteActive = false
    },

    completeDelete () {
      this.$emit('deleted')
      this.stopDelete()
    }
  }
}
</script>
