<template>
    <v-timeline-item hide-dot>
        <span class="text-uppercase text--secondary font-weight-bold is-size-5">{{ title }}</span>
    </v-timeline-item>
</template>

<script>
export default {
  name: 'TimelineItemSimple',

  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
