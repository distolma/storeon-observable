import { Observable, OperatorFunction } from 'rxjs'
import { filter } from 'rxjs/operators'
import { StoreonStore } from 'storeon'

import { StoreonEvent } from './epic'
import { StateObservable } from './StateObservable'

/**
 * Combines event type (name) and event payload (data) to the single
 * [[StoreonEvent]] object.
 *
 * @param event Type (name) of event.
 * @typeparam Event Type of event type.
 */
export function toEvent<Event extends PropertyKey> (
  event: Event
): StoreonEvent<{ [P in Event]: undefined }>

/**
 * Combines event type (name) and event payload (data) to the single
 * [[StoreonEvent]] object.
 *
 * @param type Type (name) of event.
 * @param payload The event payload (data).
 *
 * @typeparam Event Type of event type.
 */
export function toEvent<Event extends PropertyKey, Payload> (
  type: Event,
  payload: Payload
): StoreonEvent<{ [P in Event]: Payload }>
export function toEvent<Event extends PropertyKey, Data> (
  event: Event,
  value?: Data
): StoreonEvent<{ [P in Event]: Data }> {
  return (typeof value !== 'undefined'
    ? { type: event, payload: value }
    : { type: event }) as any
}

/**
 * Creates observable of store state.
 * @param store Store which will be observed for the changes.
 */
export const toStateObservable = <State, Events = any>(
  store: StoreonStore<State, Events>
): StateObservable<State> => new StateObservable<State>(store)

/**
 * Creates observable of dispatched store events.
 *
 * @param store Store which will be observed for any event.
 * @typeparam State Type of state kept within the store.
 * @typeparam Events Supported events declaration.
 *
 * @example
 * import { createStoreon } from 'storeon';
 * import { toEventObservable } from 'storeon-observable';
 * const store = createStoreon([]);
 * toEventObservable(store).subscribe(e => ...);
 */
export const toEventObservable = <State, Events = any>(
  store: StoreonStore<State, Events>
): Observable<StoreonEvent<Events>> => {
  return new Observable<StoreonEvent<Events>>(subscriber => {
    subscriber.add(
      store.on('@dispatch', (_, event) =>
        subscriber.next(toEvent(event[0], event[1]) as any)
      )
    )
  })
}

/**
 * Filters the observable of events to specific one.
 * @param event Type (name) of event which should be filtered.
 *
 * @typeparam Events All events declaration.
 * @typeparam InEvent Event types expected at input.
 * @typeparam OutEvent Event types expected at output.
 *
 * @example
 * import {Epic, ofType} from 'storeon-observable';
 * import { mapTo, delay } from 'rxjs/operators';
 * const epic = event$ => event$.pipe(
 *   ofEvent('ping'),
 *   delay(1000),
 *   mapTo(toEvent('pong')));
 */
export const ofEvent = <
  Events,
  InEvent extends keyof Events = keyof Events,
  OutEvent extends InEvent = InEvent
>(
  event: OutEvent
): OperatorFunction<
  StoreonEvent<Events, InEvent>,
  StoreonEvent<Events, OutEvent>
> => {
  return (source): Observable<StoreonEvent<Events, OutEvent>> =>
    source.pipe(
      filter((ev): ev is StoreonEvent<Events, OutEvent> => {
        return event === ev.type
      })
    )
}
