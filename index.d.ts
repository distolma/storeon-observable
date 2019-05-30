import { Store } from 'storeon';
import { Observable } from 'rxjs';

export declare interface Epic<State = unknown> {
    (action$: Observable<string>, state$: Observable<State>): Observable<string>;
}

export declare function createEpicMiddleware(rootEpic: Epic): (store: Store) => void;

export declare function combineEpics(epics: Epic[]): Epic;

export declare function ofEvent(key: string): (source: Observable<string>) => Observable<string>;