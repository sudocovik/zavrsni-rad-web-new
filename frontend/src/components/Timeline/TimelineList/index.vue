<template>
    <div>
        <TimelineItem
            v-for="item in internalItems"
            :key="item.id"

            :success="item.success"
            :time="item.time"
        >
            <span :class="{ 'font-italic': !item.success }">{{ item.content }}</span>
        </TimelineItem>
    </div>
</template>

<script>
import TimelineItem from '../TimelineItem'
import TimelineListItemModel from './TimelineListItemModel'

export default {
  name: 'TimelineList',

  props: {
    items: {
      required: true,
      type: Array,
      validator: items => items.every(item => item instanceof TimelineListItemModel)
    }
  },

  components: {
    TimelineItem
  },

  computed: {
    internalItems () {
      return this.items.map(item => ({
        id: item.id(),
        time: item.time(),
        content: item.content(),
        success: item.success()
      }))
    }
  }
}
</script>
