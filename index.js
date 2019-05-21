var operators = require('rxjs/operators')
var rxjs = require('rxjs')

function combineEpics (epics) {
  return function () {
    var args = [].slice.call(arguments)

    return rxjs.merge.apply(null, epics.map(function (epic) {
      return epic.apply(null, args)
    }))
  }
}

function createEpicMiddleware (epics) {
  var epic$ = new rxjs.BehaviorSubject(epics)

  return function (store) {
    var action$ = new rxjs.Subject()
    var state$ = new rxjs.Subject()

    store.on('@dispatch', function (_, event) {
      action$.next.apply(action$, event)
    })

    store.on('@changed', function (state) { state$.next(state) })

    var result$ = epic$.pipe(operators.switchMap(function (epic) {
      return epic(action$, state$)
    }))

    result$.subscribe(store.dispatch)
  }
}

function ofEvent () {
  var events = [].slice.call(arguments)

  return function (source) {
    return source.pipe(operators.filter(function (event) {
      return events.indexOf(event) !== -1
    }))
  }
}

module.exports = {
  ofEvent: ofEvent,
  combineEpics: combineEpics,
  createEpicMiddleware: createEpicMiddleware
}
