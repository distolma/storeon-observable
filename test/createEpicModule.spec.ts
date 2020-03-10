import { map } from 'rxjs/operators'
import { StoreonStore, createStoreon } from 'storeon'

import {
  toEvent,
  createEpicModule, ofEvent
} from '../index'

describe('createEpicModule', () => {
  let store: StoreonStore

  beforeEach(() => {
    store = createStoreon([])
  })

  it('should create proper observable of events from store', () => {
    const subscriber: any = jest.fn()
    const module = createEpicModule(
      events$ =>
        events$.pipe(
          ofEvent('a'),
          map(e => toEvent('b', e.payload))))
    module(store)

    store.on('b', subscriber)
    store.dispatch('a', 1)

    expect(subscriber).toBeCalledTimes(1)
    expect(subscriber).toBeCalledWith({}, 1)
  })
})
