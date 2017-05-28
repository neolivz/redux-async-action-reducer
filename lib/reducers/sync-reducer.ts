import { SimpleAction, hasActionRequest } from '../actions'
import { SimpleStore, shouldReducerExecute } from './reducer-common'
export interface SyncReducer<T, Q, S> {
	(state: SimpleStore<S>, action: SimpleAction<T, Q>): SimpleStore<S>
}

export interface SyncReducerGeneratorFn<Q, S> {
	(state: SimpleStore<S>, request?: Q): SimpleStore<S>
}

export interface SyncReducerGenerator {
	<T, Q, S>(type?: T, fn?: SyncReducerGeneratorFn<Q, S>): SyncReducer<T, Q, S>
}

export const isSyncStore = (store: any): store is SimpleStore<any> => {
	return typeof (store) !== 'undefined' && store.hasOwnProperty('store')
}

const defaultSyncReducerFn = <Q, S>() => {
	return (state: SimpleStore<S>, request: Q) => state
}

export const syncReducerGenerator: SyncReducerGenerator = <T, Q, S>(
	type?: T,
	fn: SyncReducerGeneratorFn<Q, S> = defaultSyncReducerFn<Q, S>()) => {
	return (state: SimpleStore<S>, action: SimpleAction<T, Q>): SimpleStore<S> => {
		if (!shouldReducerExecute(type, action)) {
			return state
		} else {
			if (hasActionRequest(action)) {
				return fn(state, action.request)
			} else {
				return fn(state)
			}
		}
	}
}

export const syncReducer: SyncReducerGenerator = <T, Q>(
	type?: T) => {
	// INFO: We are wrapping in the store object for consistency
	// and generic spread (https://github.com/Microsoft/TypeScript/pull/13288) TS 2.4
	return syncReducerGenerator<T, Q, Q>(type, (state, query) => ({ ...state, store: query }))
}
export const arraySyncCreateReducerGenerator: SyncReducerGenerator = <T, Q>(
	type?: T) => {
	return syncReducerGenerator<T, Q, Q[]>(type, (state, query) => {
		return typeof (query) !== 'undefined' ? (state.store === undefined ?
			{ ...state, store: [query] } :
			{ ...state, store: [...state.store, query] })
			: state
	})
}
export const arraySyncLoadReducerGenerator: SyncReducerGenerator = syncReducer

export const arraySyncDeleteReducerGenerator: SyncReducerGenerator = <T, Q>(
	type?: T) => {
	return syncReducerGenerator<T, Q, Q[]>(type, (state, query) => {
		return typeof (query) === 'undefined'
			|| !Array.isArray(state.store)
			|| state.store.indexOf(query) === -1
			? state : {
				...state, store: [
					...state.store.slice(0, state.store.indexOf(query)),
					...state.store.slice(state.store.indexOf(query) + 1,
						state.store.length),
				]
			}

	})
}

export const arraySyncUpdateReducerGenerator: SyncReducerGenerator = <T, Q>(
	type?: T) => {
	const reducerGenFn: SyncReducerGeneratorFn<Q[], Q[]> = (state: SimpleStore<Q[]>, query: Q[]) => {
		// const newState = { ...state }
		// I guess another typescript bug,
		// so for the time being manual update
		// if (Array.isArray(query) && Array.isArray(newState.store)) {
		// 	if (newState.store.indexOf(query[0]) > -1) {
		// 		newState.store[newState.store.indexOf(query[0])] = query[1]
		// 	}
		// }
		// return newState
		return typeof (query) === 'undefined'
			|| !Array.isArray(state.store)
			|| !Array.isArray(query)
			|| query.length !== 2
			|| state.store.indexOf(query[0]) === -1
			? state : {
				...state,
				store: [
					...state.store.slice(0, state.store.indexOf(query[0])),
					query[1],
					...state.store.slice(state.store.indexOf(query[0]) + 1,
						state.store.length),
				]
			}

	}
	return syncReducerGenerator<T, Q[], Q[]>(type, reducerGenFn)
}
