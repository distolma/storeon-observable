import { switchMap, mapTo, takeUntil } from 'rxjs/operators'
import { interval } from 'rxjs';
import { combineEpics, ofEvent } from '../';

const epic = (action$) => {
  const stop$ = action$.pipe(ofEvent('stop'));

  return action$.pipe(
    ofEvent('start'),
    switchMap(() => interval(1000).pipe(mapTo('inc'), takeUntil(stop$))),
  );
};

export const epics = combineEpics([epic])