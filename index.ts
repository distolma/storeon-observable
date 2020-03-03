import {
  BehaviorSubject, merge, Observable, OperatorFunction
} from 'rxjs'
import { filter, switchMap } from 'rxjs/operators'
import { Module, Store } from 'storeon'

/**
 * Composed Storeon event type.
 */
export type StoreonEvent<Events, Event extends keyof Events = keyof Events> = {
  type: Event;
  payload: Events[Event];
};

type StoreonEventUnion<Events> =
  { [k in keyof Events]: StoreonEvent<Events, k> }[keyof Events]

/**
 * Observable of Storeon events.
 */
export type EventsObservable<
  Events,
  Event extends keyof Events = keyof Events> =
  Observable<StoreonEvent<Events, Event>>;

/**
 * Returns the combined event object
 * @param event the event type
 */
export function toEvent<Event extends PropertyKey>(
  event: Event):
  StoreonEvent<{[P in Event]: undefined}>
/**
 * Returns the combined event object
 * @param event the event type
 * @param value the event value
 */
export function toEvent<Event extends PropertyKey, Data>(
  event: Event,
  value: Data):
  StoreonEvent<{[P in Event]: Data}>
export function toEvent<Event extends PropertyKey, Data> (
  event: Event,
  value?: Data):
  StoreonEvent<{[P in Event]: Data}> {
  return (
    (typeof value !== 'undefined')
      ? { type: event, payload: value }
      : { type: event }) as any
}

/**
 * Creates observable of dispatched store events.
 */
export const toEventObservable = <
  State,
  Events = any>(store: Store<State, Events>):
  EventsObservable<Events> => {
  return new Observable<StoreonEvent<Events>>(
    subscriber => {
      subscriber.add(store.on(
        '@dispatch', (_, event) =>
          subscriber.next(
            toEvent(event[0], event[1]) as any)))
    })
}

export class StateObservable<S> extends Observable<S> {
  get value (): S { return this._value }
  private _value: S;
  constructor (store: Store<S>) {
    super(subscriber => {
      subscriber.add(store.on(
        '@changed', state => {
          this._value = state
          subscriber.next(state)
        }))
    })
    this._value = store.get()
  }
}

/**
 * Creates observable of store state.
 */
export const toStateObservable =
  <State, Events = any>(store: Store<State, Events>):
    StateObservable<State> => new StateObservable<State>(store)

/**
 * Filters the observable
 * @param event
 */
export const ofEvent = <
  Events,
  InEvent extends keyof Events = keyof Events,
  OutEvent extends InEvent = InEvent>(event: OutEvent):
  OperatorFunction<
    StoreonEvent<Events, InEvent>,
    StoreonEvent<Events, OutEvent>> => {
  return (source): Observable<StoreonEvent<Events, OutEvent>> =>
    source.pipe(
      filter(
        (ev): ev is StoreonEvent<Events, OutEvent> => {
          return event === ev.type
        }))
}

/**
 * RxJS side-effect implementation for storeon
 */
export interface Epic<
  State,
  Events = any,
  InEvent extends keyof Events = keyof Events,
  OutEvent extends InEvent = InEvent> {
  (action$: EventsObservable<Pick<Events, InEvent>>,
   state$: StateObservable<State>):
    Observable<StoreonEventUnion<Pick<Events, OutEvent>>>;
}

/**
 * Creates Storeon module.
 */
export const createEpicModule = <
  State,
  Events = any>(
    epic: Epic<State, Events>):
  Module<State, Events> => {
  const epic$ = new BehaviorSubject(epic)
  return (store: Store<State, Events>): void => {
    const state$ = toStateObservable<State, Events>(store)
    const event$ = toEventObservable<State, Events>(store)
    epic$.pipe(
      switchMap(e => e(event$, state$))
    ).subscribe(ev =>
      (store.dispatch as any).apply(
        store, [ev.type, ev.payload]))
  }
}

/**
 * As the name suggests, allows you to take multiple epics and
 * combine them into a single one. Please keep in mind that the order
 * in which epics are combined affect the order in which they are
 * executed and receive events.
 */
export function combineEpics<
  S, Es = any, IE1 extends keyof Es = keyof Es, OE1 extends IE1 = IE1>(
  e1: Epic<S, Es, IE1, OE1>): Epic<S, Es, IE1, OE1>;
export function combineEpics<
  S, Es = any, IE1 extends keyof Es = keyof Es, OE1 extends IE1 = IE1,
  IE2 extends keyof Es = keyof Es, OE2 extends IE2 = IE2>(
  e1: Epic<S, Es, IE1, OE1>,
  e2: Epic<S, Es, IE2, OE2>): Epic<S, Es, IE1 | IE2, OE1 | OE2>;
export function combineEpics<
  S, Es = any, IE1 extends keyof Es = keyof Es, OE1 extends IE1 = IE1,
  IE2 extends keyof Es = keyof Es, OE2 extends IE2 = IE2,
  IE3 extends keyof Es = keyof Es, OE3 extends IE3 = IE3>(
  e1: Epic<S, Es, IE1, OE1>,
  e2: Epic<S, Es, IE2, OE2>,
  e3: Epic<S, Es, IE3, OE3>): Epic<S, Es, IE1 | IE2 | IE3, OE1 | OE2 | OE3>;
export function combineEpics<
  S, Es = any, IE1 extends keyof Es = keyof Es, OE1 extends IE1 = IE1,
  IE2 extends keyof Es = keyof Es, OE2 extends IE2 = IE2,
  IE3 extends keyof Es = keyof Es, OE3 extends IE3 = IE3,
  IE4 extends keyof Es = keyof Es, OE4 extends IE4 = IE4>(
  e1: Epic<S, Es, IE1, OE1>,
  e2: Epic<S, Es, IE2, OE2>,
  e3: Epic<S, Es, IE3, OE3>,
  e4: Epic<S, Es, IE4, OE4>):
  Epic<S, Es, IE1 | IE2 | IE3 | IE4, OE1 | OE2 | OE3 | OE4>;
export function combineEpics<
  S, Es = any, IE1 extends keyof Es = keyof Es, OE1 extends IE1 = IE1,
  IE2 extends keyof Es = keyof Es, OE2 extends IE2 = IE2,
  IE3 extends keyof Es = keyof Es, OE3 extends IE3 = IE3,
  IE4 extends keyof Es = keyof Es, OE4 extends IE4 = IE4,
  IE5 extends keyof Es = keyof Es, OE5 extends IE5 = IE5>(
  e1: Epic<S, Es, IE1, OE1>,
  e2: Epic<S, Es, IE2, OE2>,
  e3: Epic<S, Es, IE3, OE3>,
  e4: Epic<S, Es, IE4, OE4>,
  e5: Epic<S, Es, IE5, OE5>):
  Epic<S, Es, IE1 | IE2 | IE3 | IE4 | IE5, OE1 | OE2 | OE3 | OE4 | IE5>;
export function combineEpics<
  S, Es = any, IE extends keyof Es = keyof Es, OE extends IE = IE>(
  ...e1: Array<Epic<S, Es, IE, OE>>): Epic<S, Es, IE, OE>;
export function combineEpics (...epics: Array<Epic<any>>): Epic<any> {
  return (action$: EventsObservable<any, any>, state$: StateObservable<any>):
    EventsObservable<any, any> => {
    return merge(...epics.map(epic => epic(action$, state$)))
  }
}
