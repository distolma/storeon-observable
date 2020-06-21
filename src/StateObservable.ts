import { Observable } from 'rxjs'
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

  /**
   * @param store store which will be observed.
   */
  constructor (store: StoreonStore<S>) {
    super(subscriber => {
      subscriber.add(
        store.on('@changed', state => {
          this._value = state
          subscriber.next(state)
        })
      )
    })
    this._value = store.get()
  }
}
