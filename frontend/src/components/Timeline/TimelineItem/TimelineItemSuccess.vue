<template>
    <v-timeline-item
        icon="mdi-credit-card-check"
        fill-dot
        color="green darken-3"
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
