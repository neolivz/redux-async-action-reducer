import { AsyncAction, STARTED, SUCCESS, FAILURE } from './actions';

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

export interface ActiveStore<S> extends ActiveComponet{
  store: S;
}

// export interface AsyncArrayStore<S> extends AsyncComponent {
//   store: S[];
// }


export interface AsyncActiveStore<S> extends ActiveStore<S>, AsyncStore<S>{

}


export const initialState: AsyncStore<any> = {
    // isArray: false,
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

export interface ReducerGroupFactory<A> {
    (state: AsyncStore<A>, action: AsyncAction<any, any, A>): AsyncStore<A>;
}

export function reducerActionGroupFactory<A>(): ReducerGroupFactory<A> {
    return (state: AsyncStore<A>, action: AsyncAction<any, any, A>): AsyncStore<A> => {
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

