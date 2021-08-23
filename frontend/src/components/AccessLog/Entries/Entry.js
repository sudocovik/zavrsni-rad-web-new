export default class Entry {
    id
    _uid
    _atTime

    constructor (id, uid, atTime) {
      this.id = id
      this._uid = uid
      this._atTime = new Date(atTime)
    }

    uid () {
      return this._uid
    }

    timestamp () {
      return this._atTime
    }
}
