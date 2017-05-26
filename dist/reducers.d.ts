import { AsyncAction, SimpleAction } from './actions';
export interface Store<S> {
    store: S | S[];
}
export interface SimpleStore<S> extends Store<S> {
    store: S;
}
export interface ArrayStore<S> extends Store<S> {
    store: S[];
}
export interface AsyncComponent {
    working: boolean;
    failure: boolean;
    completed: boolean;
    startedDate?: Date;
    finishedDate?: Date;
    error?: Error;
}
export interface ActiveComponet {
    open: boolean;
}
export interface AsyncStore<S> extends AsyncComponent, SimpleStore<S> {
}
export interface ActiveStore<S> extends ActiveComponet, SimpleStore<S> {
}
export interface AsyncArrayStore<S> extends AsyncComponent, ArrayStore<S> {
}
export interface AsyncActiveStore<S> extends ActiveStore<S>, AsyncStore<S> {
}
export declare const initialState: AsyncStore<any>;
export declare const initialActiveState: AsyncActiveStore<any>;
export declare type Operations = 'C' | 'L' | 'U' | 'D';
export interface AsyncReducer<T, Q, R, S> {
    (state: AsyncStore<S>, action: AsyncAction<T, Q, R>): AsyncStore<S>;
}
export interface SyncReducer<T, Q, S> {
    (state: SimpleStore<S>, action: SimpleAction<T, Q>): SimpleStore<S>;
}
export interface AsyncReducerGeneratorFn<Q, R, S> {
    (state: AsyncStore<S>, request?: Q, response?: R, error?: Error): AsyncStore<S>;
}
export interface SyncReducerGeneratorFn<Q, S> {
    (state: SimpleStore<S>, request?: Q): SimpleStore<S>;
}
export interface SyncReducerGenerator {
    <T, Q, S>(type?: T, fn?: SyncReducerGeneratorFn<Q, S>): SyncReducer<T, Q, S>;
}
export interface AsyncReducerGenerator {
    <T, Q, R, S>(type?: T, startFn?: AsyncReducerGeneratorFn<Q, R, S>, successFn?: AsyncReducerGeneratorFn<Q, R, S>, failureFn?: AsyncReducerGeneratorFn<Q, R, S>): AsyncReducer<T, Q, R, S>;
}
export declare const syncReducerGenerator: SyncReducerGenerator;
export declare const asyncReducerGenerator: AsyncReducerGenerator;
export declare const simpleAsyncReducerGenerator: AsyncReducerGenerator;
export declare const arrayAsyncCreateReducerGenerator: AsyncReducerGenerator;
export declare const arrayAsyncLoadReducerGenerator: AsyncReducerGenerator;
export declare const arrayAsyncUpdateReducerGenerator: AsyncReducerGenerator;
export declare const arrayAsyncDeleteReducerGenerator: AsyncReducerGenerator;
export declare const createReducer: (syncReducers?: SyncReducer<any, any, any>[] | undefined, asyncReducers?: AsyncReducer<any, any, any, any>[] | undefined) => (state: AsyncStore<any> | SimpleStore<any>, action: {
    type: any;
} | ({
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
}) | ({
    type: any;
} & {
    request: any;
})) => AsyncStore<any> | SimpleStore<any>;
