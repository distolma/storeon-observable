# Storeon Observable

<img src="https://storeon.github.io/storeon/logo.svg" align="right" alt="Storeon logo by Anton Lovchikov" width="160" height="142">

A tiny rxjs 6-based middleware for [Storeon]. Compose and cancel async actions to create side effects and more. ([Demo])

The size is only 240 bytes. It uses [Size Limit] to control size.

Read more about Storeon [article]. 

[storeon]: https://github.com/storeon/storeon 
[size limit]: https://github.com/ai/size-limit
[demo]: https://codesandbox.io/s/admiring-beaver-edi8m
[article]: https://evilmartians.com/chronicles/storeon-redux-in-173-bytes 

## Install
This module has peer dependencie of `rxjs@6.x.x` which will has to be installed as well.
```sh
npm install storeon-observable
``` 

## How to use

You need to create epic using RxJS operators. This epic will listen to event `ping`, wait for 1 second and map them to a new event, `pong`

#### `epic.js`
```javascript
import { combineEpics, ofEvent } from 'storeon-observable';
import { mapTo, delay } from 'rxjs/operators'

const epic = action$ => action$.pipe(
  ofEvent('ping'),
  delay(1000),
  mapTo('pong'),
);

export const epics = combineEpics([epic]);
```

Create store and pass `epics` to the `createEpicMiddleware` function. It will connect all epics to the Storeon using the `storeon-observable` middleware

#### `store.js`
```javascript
import createStore from 'storeon'
import { createEpicMiddleware } from 'storeon-observable';

import { epics } from './epic';

let increment = store => {
  store.on('@init', () => ({ isPinging: false }))
  store.on('ping', () => ({ isPinging: true }))
  store.on('pong', () => ({ isPinging: false }))
}

export const store = createStore([increment, createEpicMiddleware(epics)]);
```