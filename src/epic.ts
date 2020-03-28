import { Observable } from 'rxjs'

import { StateObservable } from './StateObservable'

/**
 * RxJS side-effect implementation for storeon.
 * @typeparam State Type of state.
 * @typeparam Events All events declaration.
 * @typeparam InEvent Event types expected at input.
 * @typeparam OutEvent Event types expected at output.
 */
export interface Epic<
  State,
  Events = any,
  InEvent extends keyof Events = keyof Events,
  OutEvent extends InEvent = InEvent> {
  /**
   * @param event$ Observable of events dispatched on store.
   * @param state$ Observable of state.
   */
  (event$: Observable<StoreonEvent<Pick<Events, InEvent>>>,
   state$: StateObservable<State>):
    Observable<StoreonEventUnion<Pick<Events, OutEvent>>>;
}

/**
 * @hidden
 */
type StoreonEventUnion<Events> =
  { [k in keyof Events]: StoreonEvent<Events, k> }[keyof Events]

/**
 * Storeon event type.
 *
 * Storeon api dispatch/on separate event type (name) from the event payload
 * (data). For work with Observables api we will combine that two
 * details in to one object.
 * To produce proper storeon event
 *
 * @typeparam Events Supported events declaration.
 * @typeparam Event Type or types of event.
 */
export interface StoreonEvent<
  Events, Event extends keyof Events = keyof Events> {
  /**
   * Type (name) of event.
   */
  type: Event;
  /**
   * Event data (payload).
   */
  payload: Events[Event];
}
