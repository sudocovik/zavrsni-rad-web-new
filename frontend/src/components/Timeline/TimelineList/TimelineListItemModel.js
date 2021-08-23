export default class TimelineListItemModel {
    _id
    _time
    _content
    _success

    constructor (id, time, content, success) {
      this._id = id
      this._time = time
      this._content = content
      this._success = success
    }

    id () {
      return this._id
    }

    time () {
      return this._time
    }

    content () {
      return this._content
    }

    success () {
      return this._success
    }
}
