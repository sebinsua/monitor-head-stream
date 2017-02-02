import test from 'ava'
import Readable from 'readable-stream'

import monitorHeadStream from '../src'

class TestStream extends Readable {

  constructor () {
    super({ objectMode: true })
  }

  _read () {
    this.push({ id: 1 })
    this.push({ id: 2 })
    this.push({ id: 3 })
    this.push({ id: 4 })
    this.push({ id: 5 })

    this.push(null)
  }

}

const createStream = () => new TestStream()
const indexBy = obj => obj.id
const always = v => () => v

test('monitorHeadStream is a function', t => {
  t.is(typeof monitorHeadStream, 'function')
})
