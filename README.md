# Storeon Observable

[![npm version](https://badge.fury.io/js/storeon-observable.svg)](https://www.npmjs.com/package/storeon-observable)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fdistolma%2Fstoreon-observable%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/distolma/storeon-observable/goto?ref=master)

<img src="https://storeon.github.io/storeon/logo.svg" align="right" alt="Storeon logo by Anton Lovchikov" width="160" height="142">

A tiny rxjs 6-based middleware for [Storeon]. Compose and cancel async actions to create side effects and more.

The size is only 383 bytes. It uses [Size Limit] to control size.

Read more about Storeon [article]. 

[storeon]: https://github.com/storeon/storeon 
[size limit]: https://github.com/ai/size-limit
[article]: https://evilmartians.com/chronicles/storeon-redux-in-173-bytes 

## Install

**Via NPM:** This module has peer dependencie of `rxjs@6.x.x` and `storeon@3.x.x` which will has to be installed as well.
```sh
npm install -S storeon-observable
``` 
or
```sh
yarn add storeon-observable
```

**Via CDN:** Add the following script to the end of your `<head>` section.

```html
<script src="https://unpkg.com/storeon-observable/dist/storeon-observable.min.js"></script>
```

The global namespace for module is `StoreonObservable`

**Via ES Modules:** Use the following import inside your ESModule.

```html
<script type="module">
  import { createEpicModule } from 'https://cdn.pika.dev/storeon-observable'
</script>
```

## How to use

You need to create epic using RxJS operators. This epic will listen to event `ping`, wait for 1 second and map them to a new event, `pong`

#### `epic.js`
```javascript
import { combineEpics, ofEvent, toEvent } from 'storeon-observable'
import { mapTo, delay } from 'rxjs/operators'

const epic = event$ => event$.pipe(
  ofEvent('ping'),
  delay(1000),
  mapTo(toEvent('pong')),
);

export const epics = combineEpics(epic);
```

Create store and pass `epics` to the `createEpicModule` function. It will connect all epics to the Storeon using the `storeon-observable` middleware

#### `store.js`
```javascript
import { createStoreon } from 'storeon'
import { createEpicModule } from 'storeon-observable'

import { epics } from './epic';

let increment = store => {
  store.on('@init', () => ({ isPinging: false }))
  store.on('ping', () => ({ isPinging: true }))
  store.on('pong', () => ({ isPinging: false }))
}

export const store = createStoreon([increment, createEpicModule(epics)]);
```

Using TypeScript you can assign `Epic` interface to the function to specify `action` and `state` typing

#### `epic.ts`
```typescript
import { combineEpics, ofEvent, Epic, toEvent } from 'storeon-observable';
import { mapTo, delay } from 'rxjs/operators'

interface State {
  isPinging: boolean;
}

interface Events {
  ping: undefined;
  pong: undefined;
}

const epic: Epic<State, Events> = (event$, state$) => event$.pipe(
  ofEvent('ping'),
  delay(1000),
  mapTo(toEvent('pong')),
);

export const epics = combineEpics(epic);
```

## Acknowledgments

This module based on [redux-observable](https://github.com/redux-observable/redux-observable).

## License

[MIT](LICENCE)
