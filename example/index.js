import { TimelineStream } from 'scrape-twitter'
import JSONStream from 'JSONStream'
import pump from 'pump'

import monitorHeadStream from '../src'

const createStream = () => new TimelineStream('etiquiet')
const indexBy = obj => obj.id
const skipWhenPinned = obj => obj.isPinned === true

pump(
  monitorHeadStream(createStream, indexBy, skipWhenPinned),
  JSONStream.stringify('[\n', ',\n', '\n]\n'),
  process.stdout
)
