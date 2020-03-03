import { Observable } from 'rxjs'
import { Store } from 'storeon'
import * as createStore from 'storeon'
import {
  ofEvent,
  toEvent,
  toEventObservable
} from '../index'

describe('ofEvent', () => {
  let store: Store
  let observable: Observable<any>

  beforeEach(() => {
    store = createStore([])
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
