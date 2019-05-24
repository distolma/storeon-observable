var rxjs = require('rxjs')
var operators = require('rxjs/operators')

var index = require('./')

describe('combineEpics', function () {
  it('should combine epics', function () {
    function epic1 (actions) {
      return actions.pipe(
        index.ofEvent('ACTION1'),
        operators.map(function () { return 'DELEGATED1' })
      )
    }
    function epic2 (actions) {
      return actions.pipe(
        index.ofEvent('ACTION2'),
        operators.map(function () { return 'DELEGATED2' })
      )
    }

    var epic = index.combineEpics([
      epic1,
      epic2
    ])

    var store = { I: 'am', a: 'store' }
    var actions = new rxjs.Subject()
    var result = epic(actions, store)
    var emittedActions = []

    result.subscribe(function (emittedAction) {
      return emittedActions.push(emittedAction)
    })

    actions.next('ACTION1')
    actions.next('ACTION2')

    expect(emittedActions).toEqual([
      'DELEGATED1',
      'DELEGATED2'
    ])
  })

  it('should pass along every argument arbitrarily', function (done) {
    var epic1 = jest.fn(function () { return ['first'] })
    var epic2 = jest.fn(function () { return ['second'] })

    var rootEpic = index.combineEpics([
      epic1,
      epic2
    ])

    rootEpic([1, 2, 3, 4])
      .pipe(operators.toArray())
      .subscribe(function (values) {
        expect(values).toEqual(['first', 'second'])

        expect(epic1).toBeCalledTimes(1)
        expect(epic2).toBeCalledTimes(1)

        expect(epic1).toBeCalledWith([1, 2, 3, 4])
        expect(epic2).toBeCalledWith([1, 2, 3, 4])

        done()
      })
  })
})

describe('createEpicMiddleware', function () {
//    TODO
})
