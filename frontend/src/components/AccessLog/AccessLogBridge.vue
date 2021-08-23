<script>
import TimelineListItemModel from '../Timeline/TimelineList/TimelineListItemModel'
import AccessGrantedEntry from './Entries/AccessGrantedEntry'
import AccessProhibitedEntry from './Entries/AccessProhibitedEntry'
import { format, startOfYesterday } from 'date-fns'
import { groupBy, mapValues, mapKeys } from 'lodash'

const yearFormat = 'yyyy'
const dateFormat = 'dd.MM.' + yearFormat

export default {
  name: 'AccessLogBridge',

  props: {
    entries: {
      type: Array,
      required: true,
      validator: entries => entries.every(entry => entry instanceof AccessGrantedEntry || entry instanceof AccessProhibitedEntry)
    },

    cards: {
      type: Array,
      required: true
    }
  },

  computed: {
    timelineGroups () {
      const entriesGroupedByDate = groupBy(this.entries, entry => format(entry.timestamp(), dateFormat))

      const groupedEntriesWithSimplifiedDates = mapKeys(entriesGroupedByDate, (_, key) => this.simplifyDate(key))

      return mapValues(groupedEntriesWithSimplifiedDates, entries => entries.map(this.convertEntryToTimelineItem))
    }
  },

  methods: {
    createTimelineItemContent (entry) {
      const entryUid = entry.uid()

      const findCardByEntryUid = () => this.cards.find(card => card.uid === entryUid) || null

      const cardName = findCardByEntryUid()?.name || null

      return cardName ?? entryUid
    },

    convertEntryToTimelineItem (entry) {
      return new TimelineListItemModel(
        entry.id,
        format(entry.timestamp(), 'HH:mm'),
        this.createTimelineItemContent(entry),
        entry instanceof AccessGrantedEntry
      )
    },

    simplifyDate (date) {
      const today = format(new Date(), dateFormat)
      const yesterday = format(startOfYesterday(), dateFormat)
      const currentYear = format(new Date(), yearFormat)

      if (date === today) return 'Danas'
      else if (date === yesterday) return 'Jučer'
      else if (date.substr(-yearFormat.length) === currentYear) return date.substring(0, date.length - yearFormat.length)

      return date
    }
  },

  render () {
    return this.$scopedSlots.default({
      groups: this.timelineGroups
    })
  }
}
</script>
