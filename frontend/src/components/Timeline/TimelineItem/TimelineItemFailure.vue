<template>
    <v-timeline-item
        icon="mdi-lock"
        fill-dot
        color="red darken-3"
        class="custom-timeline-item"
    >
        <TimelineItemTime><slot name="time" /></TimelineItemTime>
        <TimelineItemContent><slot name="content" /></TimelineItemContent>
    </v-timeline-item>
</template>

<script>
import TimelineItemTime from './TimelineItemTime'
import TimelineItemContent from './TimelineItemContent'

export default {
  name: 'TimelineItemSuccess',

  components: {
    TimelineItemTime,
    TimelineItemContent
  }
}
</script>
