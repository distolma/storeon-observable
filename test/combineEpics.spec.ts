/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Subject } from 'rxjs'
import { map, toArray } from 'rxjs/operators'
import { combineEpics, ofEvent, toEvent } from '../index'

describe('combineEpics', () => {
  it('should combine epics', () => {
    function epic1 (actions: any) {
      return actions.pipe(
        ofEvent<any>('ACTION1'),
        map(() => { return 'DELEGATED1' })
      )
    }
    function epic2 (actions: any) {
      return actions.pipe(
        ofEvent<any>('ACTION2'),
        map(() => { return 'DELEGATED2' })
      )
    }

    const epic = combineEpics(
      epic1,
      epic2
    )

    const store = { I: 'am', a: 'store' }
    const actions = new Subject()
    const result = epic(actions as any, store as any)
    const emittedActions: any = []

    result.subscribe(emittedAction => {
      return emittedActions.push(emittedAction)
    })

    actions.next(toEvent<any>('ACTION1'))
    actions.next(toEvent<any>('ACTION2'))

    expect(emittedActions).toEqual([
      'DELEGATED1',
      'DELEGATED2'
    ])
  })

  it('should pass along every argument arbitrarily', () => {
    return new Promise(resolve => {
      const epic1: any = jest.fn(() => { return ['first'] })
      const epic2: any = jest.fn(() => { return ['second'] })

      const rootEpic = combineEpics(
        epic1,
        epic2
      )

      rootEpic([1, 2, 3, 4] as any, {} as any)
        .pipe(toArray())
        .subscribe(values => {
          expect(values).toEqual(['first', 'second'])

          expect(epic1).toHaveBeenCalledTimes(1)
          expect(epic2).toHaveBeenCalledTimes(1)

          expect(epic1).toHaveBeenCalledWith([1, 2, 3, 4], {})
          expect(epic2).toHaveBeenCalledWith([1, 2, 3, 4], {})

          resolve()
        })
    })
  })
})
