import { map } from 'rxjs/operators'
import { Store } from 'storeon'
import * as createStore from 'storeon'
import {
  toEvent,
  createEpicModule, ofEvent
} from '../index'

describe('createEpicModule', () => {
  let store: Store

  beforeEach(() => {
    store = createStore([])
  })

  it('should create proper observable of events from store', () => {
    const subscriber: any = jest.fn()
    const module = createEpicModule(
      events$ =>
        events$.pipe(
          ofEvent<any>('a'),
          map(e => toEvent('b', e.payload))))
    module(store)

    store.on('b', subscriber)
    store.dispatch('a', 1)

    expect(subscriber).toBeCalledTimes(1)
    expect(subscriber).toBeCalledWith({}, 1)
  })
})
