const Readable = require('readable-stream/readable')

class MonitorHeadStream extends Readable {
  constructor () {
    super({ objectMode: true })
  }

  _read () {
  }
}

module.exports = MonitorHeadStream
