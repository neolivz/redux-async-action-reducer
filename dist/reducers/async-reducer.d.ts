import { AsyncAction } from '../actions';
import { SimpleStore, ArrayStore } from './reducer-common';
export interface AsyncComponent {
    working: boolean;
    failure: boolean;
    completed: boolean;
    startedDate?: Date;
    finishedDate?: Date;
    error?: Error;
}
export interface AsyncStore<S> extends AsyncComponent, SimpleStore<S> {
}
export interface AsyncArrayStore<S> extends AsyncComponent, ArrayStore<S> {
}
export interface AsyncReducer<T, Q, R, S> {
    (state: AsyncStore<S>, action: AsyncAction<T, Q, R>): AsyncStore<S>;
}
export interface AsyncReducerGeneratorFn<Q, R, S> {
    (state: AsyncStore<S>, request?: Q, response?: R, error?: Error): AsyncStore<S>;
}
export interface AsyncReducerGenerator {
    <T, Q, R, S>(type?: T, startFn?: AsyncReducerGeneratorFn<Q, R, S>, successFn?: AsyncReducerGeneratorFn<Q, R, S>, failureFn?: AsyncReducerGeneratorFn<Q, R, S>): AsyncReducer<T, Q, R, S>;
}
export declare const initialState: AsyncStore<any>;
export declare const isAsyncStore: (store: any) => store is AsyncStore<any>;
export declare const asyncReducerGenerator: AsyncReducerGenerator;
export declare const asyncReducer: AsyncReducerGenerator;
export declare const arrayAsyncCreateReducer: AsyncReducerGenerator;
export declare const arrayAsyncLoadReducer: AsyncReducerGenerator;
export declare const arrayAsyncUpdateReducer: AsyncReducerGenerator;
export declare const arrayAsyncDeleteReducer: AsyncReducerGenerator;
