import createStore from 'storeon'
import { createEpicMiddleware } from '../';
import { epics } from './epic';

let increment = store => {
  store.on('@init', () => ({ count: 0 }))
  store.on('inc', ({ count }) => ({ count: count + 1 }))
  store.on('reset', () => ({ count: 0 }))
}

export const store = createStore([increment, createEpicMiddleware(epics)])