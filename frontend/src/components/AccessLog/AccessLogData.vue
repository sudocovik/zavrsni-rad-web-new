<script>
import axios from 'axios'
import { convertRawEntriesToEntryModels } from './Entries/entry-utils'

export default {
  name: 'AccessLogData',

  data: () => ({
    entries: []
  }),

  created () {
    this.fetchAccessLogEntries()
  },

  methods: {
    async fetchAccessLogEntries () {
      const { data: { data } } = await axios.get('/api/access-log')

      this.entries = convertRawEntriesToEntryModels(data)
    }
  },

  render () {
    return this.$scopedSlots.default({
      entries: this.entries
    })
  }
}
</script>
