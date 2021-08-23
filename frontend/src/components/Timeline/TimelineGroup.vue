<template>
    <div>
        <TimelineItemSimple :title="title" />

        <TimelineList :items="items" />
    </div>
</template>

<script>
import TimelineItemSimple from './TimelineItem/TimelineItemSimple'
import TimelineList from './TimelineList'
import TimelineListItemModel from './TimelineList/TimelineListItemModel'

export default {
  name: 'TimelineGroup',

  components: {
    TimelineItemSimple,
    TimelineList
  },

  props: {
    title: {
      type: String,
      required: true
    },

    items: {
      type: Array,
      required: true,
      validator: items => items.every(item => item instanceof TimelineListItemModel)
    }
  }
}
</script>
