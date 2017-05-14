import { AsyncAction, SimpleAction, STARTED, SUCCESS, FAILURE } from './actions';

export interface Store<S, B extends boolean> {
    isArray: B;
    store: S | S[]
}

export interface SimpleStore<S> extends Store<S, false> {
    isArray: false;
    store: S;
}
export interface ArrayStore<S> extends Store<S, true> {
    isArray: true;
    store: S[];
}

export interface AsyncComponent {
    working: boolean;
    failure: boolean;
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


export const initialState: AsyncStore<any> = {
    isArray: false,
    failure: false,
    working: false,
    store: undefined
};

export const initialActiveState: AsyncActiveStore<any> = { ...initialState, open: false };
// export const initialArrayStore: AsyncArrayStore<any>{
//     isArray: true,
//     failure: false,
//     loading: false,
//     store: undefined
// }
// export type operations = 'C' | 'U' | 'D';

// export interface ReducerGroupFactory<T, Q, R> {
//     (state: AsyncStore<R>, action: SimpleAction<T, R>): SimpleStore<R>;
// }


export interface ReducerGroupFactory<T, Q, R> {
    (state: AsyncStore<R>, action: AsyncAction<T, Q, R>): AsyncStore<R>;
}

export interface createAsyncActionReducer {
    <T, R, S>(): ReducerGroupFactory<T, R, S>
}

export const createAsyncActionReducer: createAsyncActionReducer = <T, Q, R>() => {
    return (state: AsyncStore<R>, action: AsyncAction<T, Q, R>): AsyncStore<R> => {
        if (action.status === STARTED) {
            return { ...state, failure: false, working: true };
        } else if (action.status === SUCCESS) {
            return { ...state, failure: false, working: false, store: action.response };
        } else if (action.status === FAILURE) {
            return { ...state, failure: true, working: false };
        }
        return state;
    }
}

