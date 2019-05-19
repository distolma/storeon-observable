var BehaviorSubject = require('rxjs').BehaviorSubject
var Subject = require('rxjs').Subject
var merge = require('rxjs').merge
var switchMap = require('rxjs/operators').switchMap
var filter = require('rxjs/operators').filter

function combineEpics (epics) {
  return function () {
    var args = [].slice.call(arguments)

    return merge.apply(null, epics.map(function (epic) {
      return epic.apply(null, args)
    }))
  }
}

function createEpicMiddleware (epics) {
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

function ofEvent () {
  var events = [].slice.call(arguments)

  return function (source) {
    return source.pipe(filter(function (event) {
      return events.indexOf(event) !== -1
    }))
  }
}

module.exports = {
  ofEvent: ofEvent,
  combineEpics: combineEpics,
  createEpicMiddleware: createEpicMiddleware
}
