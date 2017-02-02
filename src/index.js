import Readable from 'readable-stream'
import Transform from 'readable-stream/transform'
import continueStream from 'continue-stream'

const NEXT_INTERVAL = 5000

const always = value => () => value
const toId = (v = {}) => v.id

class ConsumeUntil extends Transform {

  i = 0

  stopWhen = null
  toIdentifier = null
  skip = null
  disconnectStream = null

  constructor (stopWhen = always(true), toIdentifier = toId, skip = always(false), disconnectStream) {
    super({ objectMode: true })
    this.stopWhen = stopWhen
    this.toIdentifier = toIdentifier
    this.skip = skip
    this.disconnectStream = disconnectStream
  }

  _transform = (obj, enc, cb) => {
    if (this.skip(obj)) {
      cb()
      return
    }

    const currentId = this.toIdentifier(obj)

    this.lastValue = currentId
    if (!this.firstValue) {
      this.firstValue = currentId
    }

    if (this.stopWhen(obj, this.i)) {
      if (this.disconnectStream) {
        this.disconnectStream._read = () => {
          this.disconnectStream.push(null)
          return false
        }
      }
      this.push(null)
    } else {
      this.push(obj)
      this.i++
    }

    cb()
  }

}

function createNext (createStream, indexBy = toId, skip = always(false), interval = NEXT_INTERVAL) {
  return function next (cb, previousStream) {
    const hasCount = count => (_, i) => i >= count
    const stopAt = value => currentValue => value === indexBy(currentValue)
    const stopWhen = previousStream ? stopAt(previousStream.firstValue) : hasCount(1)

    const stream = createStream()
    const consumeUntil = new ConsumeUntil(stopWhen, indexBy, skip, stream)

    return setTimeout(() => cb(null, stream.pipe(consumeUntil)), previousStream ? interval : 0)
  }
}

const monitorHeadStream = (createStream, toId, skipWhenPinned) =>
  continueStream.obj(createNext(createStream, toId, skipWhenPinned))

export default monitorHeadStream
