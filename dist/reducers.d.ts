import { AsyncAction } from './actions';
export interface AsyncComponent {
    working: boolean;
    failure: boolean;
}
export interface ActiveComponet {
    open: boolean;
}
export interface AsyncStore<S> extends AsyncComponent {
    store: S;
}
export interface ActiveStore<S> extends ActiveComponet {
    store: S;
}
export interface AsyncActiveStore<S> extends ActiveStore<S>, AsyncStore<S> {
}
export declare const initialState: AsyncStore<any>;
export declare const initialActiveState: AsyncActiveStore<any>;
export interface ReducerGroupFactory<A> {
    (state: AsyncStore<A>, action: AsyncAction<any, any, A>): AsyncStore<A>;
}
export declare function reducerActionGroupFactory<A>(): ReducerGroupFactory<A>;
