import { SimpleAction } from '../actions';
import { SimpleStore } from './reducer-common';
export interface SyncReducer<T, Q, S> {
    (state: SimpleStore<S>, action: SimpleAction<T, Q>): SimpleStore<S>;
}
export interface SyncReducerGeneratorFn<Q, S> {
    (state: SimpleStore<S>, request?: Q): SimpleStore<S>;
}
export interface SyncReducerGenerator {
    <T, Q, S>(type?: T, fn?: SyncReducerGeneratorFn<Q, S>): SyncReducer<T, Q, S>;
}
export declare const syncReducerGenerator: SyncReducerGenerator;
export declare const syncReducer: SyncReducerGenerator;
export declare const arraySyncCreateReducerGenerator: SyncReducerGenerator;
export declare const arraySyncLoadReducerGenerator: SyncReducerGenerator;
export declare const arraySyncDeleteReducerGenerator: SyncReducerGenerator;
export declare const arraySyncUpdateReducerGenerator: SyncReducerGenerator;
