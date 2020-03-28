import { Observable } from 'rxjs'
import { StoreonStore, createStoreon } from 'storeon'

import {
  ofEvent,
  toEvent,
  toEventObservable
} from '../src'

describe('ofEvent', () => {
  let store: StoreonStore
  let observable: Observable<any>

  beforeEach(() => {
    store = createStoreon([])
    observable = toEventObservable(store)
  })

  it('should properly filter events', () => {
    const subscriber: any = jest.fn()
    const sub = observable.pipe(
      ofEvent<any>('b')
    ).subscribe(subscriber)
    store.dispatch('a', 1)
    store.dispatch('b', 2)
    expect(subscriber).toBeCalledTimes(1)
    expect(subscriber).toBeCalledWith(toEvent('b', 2))
    sub.unsubscribe()
  })
})
