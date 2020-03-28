import { Observable } from 'rxjs'
import { StoreonStore, createStoreon } from 'storeon'

import {
  toEvent,
  toEventObservable
} from '../src'

describe('toEventObservable', () => {
  let store: StoreonStore
  let observable: Observable<any>

  beforeEach(() => {
    store = createStoreon([])
    observable = toEventObservable(store)
  })

  it('should create proper observable of events from store', () => {
    const subscriber: any = jest.fn()
    const sub = observable.subscribe(subscriber)
    store.dispatch('a', 1)
    expect(subscriber).toBeCalledTimes(1)
    expect(subscriber).toBeCalledWith(toEvent('a', 1))
    sub.unsubscribe()
  })

  it('should stop notify on unsubscribe', () => {
    const subscriber: any = jest.fn()
    const sub = observable.subscribe(subscriber)
    sub.unsubscribe()
    store.dispatch('a', 1)
    expect(subscriber).toBeCalledTimes(0)
  })
})
