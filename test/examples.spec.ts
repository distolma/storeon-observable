import { map, tap } from 'rxjs/operators'
import { createStoreon } from 'storeon'

import { combineEpics, createEpicModule, Epic, ofEvent, toEvent } from '../src'

describe('examples', () => {
  it('example 1', async () => {
    const pongSpy: any = jest.fn()
    const pingSpy: any = jest.fn()
    let resume: () => void
    const semaphore = new Promise<void>(resolve => {
      resume = resolve
    })

    interface State {
      isPinging: boolean
    }

    interface Events {
      ping: number
      pong: string
    }

    const epic: Epic<State, Events> = events$ =>
      events$.pipe(
        ofEvent('ping'),
        map(ev => {
          if (ev.payload > 1) {
            return toEvent('ping', ev.payload - 1)
          } else {
            return toEvent('pong', 'done')
          }
        }),
        tap(x => x.type === 'pong' && resume())
      )

    const epics = combineEpics(epic)
    const store = createStoreon<State, Events>([createEpicModule(epics)])

    store.on('ping', pingSpy)
    store.on('pong', pongSpy)
    store.dispatch('ping', 3)

    await semaphore

    expect(pingSpy).toBeCalledTimes(3)
    expect(pongSpy).toBeCalledTimes(1)
    expect(pongSpy).toBeCalledWith({}, 'done', store)
  })
})
