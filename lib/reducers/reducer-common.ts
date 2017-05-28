import { AsyncAction, SimpleAction } from '../actions'
import { AsyncStore, AsyncReducer, isAsyncStore } from './async-reducer'
import { SyncReducer, isSyncStore } from './sync-reducer'

export interface Store<S> {
	store: S | S[]
}

export interface SimpleStore<S> extends Store<S> {
	store: S
}
export interface ArrayStore<S> extends Store<S> {
	store: S[]
}

// CRUD instead of Reading we would be loading from the service
// NOTE: Not used atm, would add intermittent layer between CRUD api calls
// and generator invocation
// Should change to string based enum when TS 2.4 releases
// (https://github.com/Microsoft/TypeScript/pull/15486)
export type Operations = 'C' | 'L' | 'U' | 'D'

export function shouldReducerExecute(type: any | any[] | undefined, action: SimpleAction<any, any>) {
	// if type is an array and action type exists in the array it should execute
	// if type is string and exactly matching with action type
	// if type is undefined, i.e. optional
	return (Array.isArray(type) && type.indexOf(action.type) > -1)
		|| (typeof (type) === 'string' && type === action.type)
		|| (typeof (type) === 'undefined')
}

export const createReducer = (initialState: AsyncStore<any> | SimpleStore<any>, syncReducers?: SyncReducer<any, any, any>[], asyncReducers?: (AsyncReducer<any, any, any, any>[])) => {
	return (state: AsyncStore<any> | SimpleStore<any> | any, action: AsyncAction<any, any, any> | SimpleAction<any, any>) => {
		if (typeof (state) === 'undefined') {
			state = initialState
		}
		// We invoke all the sync reducer
		syncReducers && syncReducers.forEach((reducer) => {
			// After each reducer new state will be assigned to state object
			if (isSyncStore(state)) {
				state = reducer(state, action)
			}
		})

		asyncReducers && asyncReducers.forEach((reducer) => {
			// If state is not AsyncStore we should not invoke async reducers
			if (isAsyncStore(state)) {
				// If it has working property at root level state is AsyncStore
				state = reducer(state as AsyncStore<any>, action as AsyncAction<any, any, any>)
			}
		})
		return state
	}
}
