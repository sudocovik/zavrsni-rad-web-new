<template>
    <component :is="successOrFailureComponent">
        <template #time>{{ time }}</template>
        <template #content><slot /></template>
    </component>
</template>

<script>
import TimelineItemSuccess from './TimelineItemSuccess'
import TimelineItemFailure from './TimelineItemFailure'

const isValidTimeFormat = time => /^(\d){2}:(\d){2}$/.test(time)

export default {
  name: 'TimelineItem',

  components: {
    TimelineItemSuccess,
    TimelineItemFailure
  },

  props: {
    success: {
      type: Boolean,
      required: true
    },

    time: {
      type: String,
      required: true,
      validator: time => isValidTimeFormat(time)
    }
  },

  computed: {
    successOrFailureComponent () {
      return this.success === true ? TimelineItemSuccess : TimelineItemFailure
    }
  }
}
</script>
