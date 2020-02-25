let operators = require('rxjs/operators')
let rxjs = require('rxjs')

function combineEpics (epics) {
  return function (...args) {
    return rxjs.merge.apply(null, epics.map(epic => {
      return epic.apply(null, args)
    }))
  }
}

function createEpicMiddleware (epics) {
  let epic$ = new rxjs.BehaviorSubject(epics)

  return function (store) {
    let action$ = new rxjs.Subject()
    let state$ = new rxjs.Subject()

    store.on('@dispatch', (_, event) => {
      action$.next.apply(action$, event)
    })

    store.on('@changed', state => { state$.next(state) })

    let result$ = epic$.pipe(operators.switchMap(epic => {
      return epic(action$, state$)
    }))

    result$.subscribe(store.dispatch)
  }
}

function ofEvent (...events) {
  return function (source) {
    return source.pipe(operators.filter(event => {
      return events.includes(event)
    }))
  }
}

module.exports = {
  ofEvent,
  combineEpics,
  createEpicMiddleware
}
