<template>
    <Timeline v-if="hasGroups">
        <TimelineGroup
            v-for="(items, date) of groups"
            :key="date"

            :title="date"
            :items="items"
        />
    </Timeline>
    <NoData v-else>
        Nema povijesti otvaranja kutije
    </NoData>
</template>

<script>
import NoData from '../NoData'
import Timeline from '../Timeline'
import TimelineGroup from '../Timeline/TimelineGroup'
import TimelineListItemModel from '../Timeline/TimelineList/TimelineListItemModel'
import { flatten, isEmpty } from 'lodash'

export default {
  name: 'AccessLogTimeline',

  components: {
    NoData,
    Timeline,
    TimelineGroup
  },

  props: {
    groups: {
      type: Object,
      required: true,
      validator: groups => {
        const dates = Object.keys(groups)
        const items = flatten(Object.values(groups))

        const everyDateIsString = dates.every(date => typeof date === 'string')
        const everyItemIsInstanceOfTimelineListItemModel = items.every(item => item instanceof TimelineListItemModel)

        return everyDateIsString && everyItemIsInstanceOfTimelineListItemModel
      }
    }
  },

  computed: {
    hasGroups () {
      return !isEmpty(this.groups)
    }
  }
}
</script>
