<template>
    <AccessLogData>
        <template v-slot:default="{ entries }">
            <AccessLogBridge
                :entries="entries"
                :cards="cards"
            >
                <template v-slot:default="{ groups }">
                    <AccessLogTimeline :groups="groups" />
                </template>
            </AccessLogBridge>
        </template>
    </AccessLogData>
</template>

<script>
import AccessLogData from './AccessLogData'
import AccessLogBridge from './AccessLogBridge'
import AccessLogTimeline from './AccessLogTimeline'

export default {
  name: 'AccessLog',

  components: {
    AccessLogData,
    AccessLogBridge,
    AccessLogTimeline
  },

  props: {
    cards: {
      type: Array,
      required: true
    }
  }
}
</script>
