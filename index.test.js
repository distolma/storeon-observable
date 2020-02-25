let rxjs = require('rxjs')
let operators = require('rxjs/operators')

let index = require('./')

describe('combineEpics', () => {
  it('should combine epics', () => {
    function epic1 (actions) {
      return actions.pipe(
        index.ofEvent('ACTION1'),
        operators.map(() => { return 'DELEGATED1' })
      )
    }
    function epic2 (actions) {
      return actions.pipe(
        index.ofEvent('ACTION2'),
        operators.map(() => { return 'DELEGATED2' })
      )
    }

    let epic = index.combineEpics([
      epic1,
      epic2
    ])

    let store = { I: 'am', a: 'store' }
    let actions = new rxjs.Subject()
    let result = epic(actions, store)
    let emittedActions = []

    result.subscribe(emittedAction => {
      return emittedActions.push(emittedAction)
    })

    actions.next('ACTION1')
    actions.next('ACTION2')

    expect(emittedActions).toEqual([
      'DELEGATED1',
      'DELEGATED2'
    ])
  })

  it('should pass along every argument arbitrarily', () => {
    return new Promise(resolve => {
      let epic1 = jest.fn(() => { return ['first'] })
      let epic2 = jest.fn(() => { return ['second'] })

      let rootEpic = index.combineEpics([
        epic1,
        epic2
      ])

      rootEpic([1, 2, 3, 4])
        .pipe(operators.toArray())
        .subscribe(values => {
          expect(values).toEqual(['first', 'second'])

          expect(epic1).toHaveBeenCalledTimes(1)
          expect(epic2).toHaveBeenCalledTimes(1)

          expect(epic1).toHaveBeenCalledWith([1, 2, 3, 4])
          expect(epic2).toHaveBeenCalledWith([1, 2, 3, 4])

          resolve()
        })
    })
  })
})

describe('createEpicMiddleware', () => {
//    TODO
})
