var BehaviorSubject = require('rxjs').BehaviorSubject
var Subject = require('rxjs').Subject
var switchMap = require('rxjs/operators').switchMap

module.exports = function (epics) {
  var epic$ = new BehaviorSubject(epics)

  return function (store) {
    var action$ = new Subject()
    var state$ = new Subject()

    store.on('@dispatch', function (_, event) {
      action$.next.apply(action$, event)
    })

    store.on('@changed', function (state) { state$.next(state) })

    var result$ = epic$.pipe(switchMap(function (epic) {
      return epic(action$, state$)
    }))

    result$.subscribe(store.dispatch)
  }
}
