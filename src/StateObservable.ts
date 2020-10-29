import { Observable, Subject } from 'rxjs'
import { StoreonStore } from 'storeon'

/**
 * Storeon store state observable.
 */
export class StateObservable<S> extends Observable<S> {
  /**
   * Current value of state.
   */
  get value (): S {
    return this._value
  }

  private _value: S

  private _notifier = new Subject<S>()

  private _unbind: () => void

  /**
   * @param store store which will be observed.
   */
  constructor (store: StoreonStore<S>) {
    super(subscriber => {
      const subscription = this._notifier.subscribe(subscriber)
      if (subscription && !subscription.closed) {
        subscriber.next(this._value)
      }

      subscriber.add(this._unbind)

      return subscription
    })

    this._unbind = store.on('@changed', state => {
      this._value = state
      this._notifier.next(state)
    })

    this._value = store.get()
  }
}
