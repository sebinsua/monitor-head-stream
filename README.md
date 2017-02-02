# `monitor-head-stream` [![Build Status](https://travis-ci.org/sebinsua/monitor-head-stream.png)](https://travis-ci.org/sebinsua/monitor-head-stream) [![npm version](https://badge.fury.io/js/monitor-head-stream.svg)](https://npmjs.org/package/monitor-head-stream)
> 💦 Monitor the head of a stream

This module polls streams of objects for their latest item(s).

It's sort of like `tail -f` for [`Stream`s](https://nodejs.org/api/stream.html), but acts upon the head of the stream.

It was created in order to help implement small-scale firehoses.

Other applications might include sending alerts [via SMS](https://github.com/twilio/twilio-node) or [OSX notifications](https://github.com/mikaelbr/node-notifier) on breaking news or the mention of particular topics.

## Example

```js
import { TimelineStream } from 'scrape-twitter'
import JSONStream from 'JSONStream'
import pump from 'pump'

import monitorHeadStream from 'monitor-head-stream'

const createStream = () => new TimelineStream('POTUS')
const indexBy = obj => obj.id
const skipWhenPinned = obj => obj.isPinned === true

pump(
  monitorHeadStream(createStream, indexBy, skipWhenPinned),
  JSONStream.stringify('[\n', ',\n', '\n]\n'),
  process.stdout
)
```

## Install

*With `yarn`*:
```sh
yarn add monitor-head-stream
```

*With `npm`*:
```sh
npm install --save monitor-head-stream
```
