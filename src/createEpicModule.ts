import { BehaviorSubject } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { StoreonModule, StoreonStore } from 'storeon'

import { Epic } from './epic'
import { toStateObservable, toEventObservable } from './operators'

/**
 * Creates Storeon RxJs module.
 */
export const createEpicModule = <
  State,
  Events = any>(
    epic: Epic<State, Events>):
  StoreonModule<State, Events> => {
  const epic$ = new BehaviorSubject(epic)
  return (store: StoreonStore<State, Events>): void => {
    const state$ = toStateObservable<State, Events>(store)
    const event$ = toEventObservable<State, Events>(store)
    epic$.pipe(
      switchMap(e => e(event$, state$))
    ).subscribe(ev =>
      (store.dispatch as any).apply(
        store, [ev.type, ev.payload]))
  }
}
