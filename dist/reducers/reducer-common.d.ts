import { SimpleAction } from '../actions';
import { AsyncStore, AsyncReducer } from './async-reducer';
import { SyncReducer } from './sync-reducer';
export interface Store<S> {
    store: S | S[];
}
export interface SimpleStore<S> extends Store<S> {
    store: S;
}
export interface ArrayStore<S> extends Store<S> {
    store: S[];
}
export declare type Operations = 'C' | 'L' | 'U' | 'D';
export declare function shouldReducerExecute(type: any | any[] | undefined, action: SimpleAction<any, any>): boolean;
export declare const createReducer: (initialState: SimpleStore<any> | AsyncStore<any>, syncReducers?: SyncReducer<any, any, any>[] | undefined, asyncReducers?: AsyncReducer<any, any, any, any>[] | undefined) => (state: any, action: {
    type: any;
} | ({
    type: any;
} & {
    request: any;
}) | ({
    status: "SUCCESS";
} & {
    type: any;
} & {
    request: any;
} & {
    response: any;
}) | ({
    status: "FAILURE";
} & {
    type: any;
} & {
    request: any;
} & {
    error: Error;
}) | ({
    status: "STARTED";
} & {
    type: any;
} & {
    request: any;
})) => any;
