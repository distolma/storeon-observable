import { Observable, merge } from 'rxjs'

import { Epic } from './epic'
import { StateObservable } from './StateObservable'

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
  return (event$: Observable<any>, state$: StateObservable<any>):
    Observable<any> => {
    return merge(...epics.map(epic => epic(event$, state$)))
  }
}
