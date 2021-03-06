import { StoreonStore, createStoreon } from 'storeon'

import { toStateObservable, StateObservable } from '../src'

describe('toStateObservable', () => {
  let store: StoreonStore
  let observable: StateObservable<any>

  beforeEach(() => {
    store = createStoreon([])
    observable = toStateObservable(store)
  })

  it('should create proper observable of state from store', () => {
    store.on('a1', () => ({ x: 1 }))
    const subscriber: any = jest.fn()
    const sub = observable.subscribe(subscriber)
    expect(subscriber).toBeCalledTimes(1)
    expect(subscriber).toBeCalledWith({})
    expect(observable.value).toEqual({})
    store.dispatch('a1')
    expect(subscriber).toBeCalledTimes(2)
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
    expect(subscriber).toBeCalledTimes(1)
    expect(subscriber).toBeCalledWith({})
    expect(observable.value).toEqual({})
  })
})
