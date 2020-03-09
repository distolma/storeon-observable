import { Store } from 'storeon'
import * as createStore from 'storeon'
import { toStateObservable, StateObservable } from '../index'

describe('toStateObservable', () => {
  let store: Store
  let observable: StateObservable<any>

  beforeEach(() => {
    store = createStore([])
    observable = toStateObservable(store)
  })

  it('should create proper observable of state from store', () => {
    store.on('a1', () => ({ x: 1 }))
    const subscriber: any = jest.fn()
    const sub = observable.subscribe(subscriber)
    expect(subscriber).toBeCalledTimes(0)
    expect(observable.value).toEqual({})
    store.dispatch('a1')
    expect(subscriber).toBeCalledTimes(1)
    expect(subscriber).toBeCalledWith({ x: 1 })
    expect(observable.value).toEqual({ x: 1 })
    sub.unsubscribe()
  })

  it('should not notify after unsubscribe', () => {
    store.on('a1', () => ({ x: 1 }))
    const subscriber: any = jest.fn()
    const sub = observable.subscribe(subscriber)
    sub.unsubscribe()
    store.dispatch('a1')
    expect(subscriber).toBeCalledTimes(0)
    expect(observable.value).toEqual({ })
  })
})
