import { Observable } from 'rxjs'
import { Store } from 'storeon'
import * as createStore from 'storeon'
import {
  toEvent,
  toEventObservable
} from '../index'

describe('toEventObservable', () => {
  let store: Store
  let observable: Observable<any>

  beforeEach(() => {
    store = createStore([])
    observable = toEventObservable(store)
  })

  it('should create proper observable of events from store', () => {
    const subscriber: any = jest.fn()
    const sub = observable.subscribe(subscriber)
    store.dispatch('a', 1)
    expect(subscriber).toBeCalledTimes(1)
    expect(subscriber).toBeCalledWith(toEvent<any>('a', 1))
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
