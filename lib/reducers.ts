import { AsyncAction, SimpleAction, STARTED, SUCCESS, FAILURE } from './actions'

export interface Store<S> {
	store: S | S[]
}

export interface SimpleStore<S> extends Store<S> {
	store: S
}
export interface ArrayStore<S> extends Store<S> {
	store: S[]
}

export interface AsyncComponent {
	working: boolean
	failure: boolean
	completed: boolean
	startedDate?: Date,
	finishedDate?: Date,
	error?: Error,
}

export interface ActiveComponet {
	open: boolean
}

export interface AsyncStore<S> extends AsyncComponent, SimpleStore<S> { }

export interface ActiveStore<S> extends ActiveComponet, SimpleStore<S> { }

export interface AsyncArrayStore<S> extends AsyncComponent, ArrayStore<S> { }

export interface AsyncActiveStore<S> extends ActiveStore<S>, AsyncStore<S> { }

export const initialState: AsyncStore<any> = {
	failure: false,
	working: false,
	completed: false,
	store: undefined,
}

export const initialActiveState: AsyncActiveStore<any> = { ...initialState, open: false }

export type Operations = 'C' | 'L' | 'U' | 'D' // CRUD instead of Reading we would be loading from the service

export interface AsyncReducer<T, Q, R, S> {
	(state: AsyncStore<S>, action: AsyncAction<T, Q, R>): AsyncStore<S>
}
export interface SyncReducer<T, Q, S> {
	(state: SimpleStore<S>, action: SimpleAction<T, Q>): SimpleStore<S>
}

export interface AsyncReducerGeneratorFn<Q, R, S> {
	(state: AsyncStore<S>, request?: Q, response?: R, error?: Error): AsyncStore<S>
}
export interface SyncReducerGeneratorFn<Q, S> {
	(state: SimpleStore<S>, request?: Q): SimpleStore<S>
}

export interface SyncReducerGenerator {
	<T, Q, S>(type?: T, fn?: SyncReducerGeneratorFn<Q, S>): SyncReducer<T, Q, S>
}

export interface AsyncReducerGenerator {
	<T, Q, R, S>(
		type?: T,
		startFn?: AsyncReducerGeneratorFn<Q, R, S>,
		successFn?: AsyncReducerGeneratorFn<Q, R, S>,
		failureFn?: AsyncReducerGeneratorFn<Q, R, S>)
		: AsyncReducer<T, Q, R, S>
}

function defaultSyncReducerFn<Q, S>() {
	const fn: SyncReducerGeneratorFn<Q, S> = <S>(state: SimpleStore<S>) => {
		return state
	}
	return fn
}
function defaultStartReducerFn<Q, R, S>() {
	const startFn: AsyncReducerGeneratorFn<Q, R, S> = <R>(state: AsyncStore<R>) => {
		return { ...state, failure: false, working: true, completed: false, started: new Date(), finished: undefined }
	}
	return startFn
}
function defaultSuccessReducerFn<Q, R, S>() {
	const successFn: AsyncReducerGeneratorFn<Q, R, S> = <R>(state: AsyncStore<R>, request: Q, response: R) => {
		return { ...state, failure: false, working: false, completed: true, store: response, finished: new Date() }
	}
	return successFn
}
function defaultFailureReducerFn<Q, R, S>() {
	const failureFn: AsyncReducerGeneratorFn<Q, R, S> = <R>(state: AsyncStore<R>, request: R, response: any, error: Error) => {
		return { ...state, failure: true, working: false, completed: false, finished: new Date(), error }
	}
	return failureFn
}

export const syncReducerGenerator: SyncReducerGenerator = <T, Q, R, S>(
	type: T,
	fn: AsyncReducerGeneratorFn<Q, R, S>) => {
	return (state: AsyncStore<S>, action: AsyncAction<T, Q, R>): AsyncStore<S> => {
		if (type !== action.type) {
			return state
		} else {
			return fn(state, action.request)
		}
	}
}
export const asyncReducerGenerator: AsyncReducerGenerator = <T, Q, R, S>(
	type: T | undefined,
	startFn: AsyncReducerGeneratorFn<Q, R, S> = defaultStartReducerFn<Q, R, S>(),
	successFn: AsyncReducerGeneratorFn<Q, R, S> = defaultSuccessReducerFn<Q, R, S>(),
	failureFn: AsyncReducerGeneratorFn<Q, R, S> = defaultFailureReducerFn<Q, R, S>()) => {
	return (state: AsyncStore<S>, action: AsyncAction<T, Q, R>): AsyncStore<S> => {
		// If type is undefined we invoke it for every action
		if (type !== action.type && typeof (type) !== 'undefined') {
			return state
		} else if (action.status === STARTED) {
			return startFn(state, action.request)
		} else if (action.status === SUCCESS) {
			return successFn(state, action.request, action.response)
		} else if (action.status === FAILURE) {
			return failureFn(state, action.request, undefined, action.error)
		}
		return state
	}
}

export const simpleAsyncReducerGenerator: AsyncReducerGenerator = <T, Q, R>(t: T) => {
	return asyncReducerGenerator<T, Q, R, R>(t, defaultStartReducerFn<Q, R, R>(), defaultSuccessReducerFn<Q, R, R>(), defaultFailureReducerFn<Q, R, R>())
}

export const arrayAsyncCreateReducerGenerator: AsyncReducerGenerator = <T, Q, R>(t: T) => {
	const successFn: AsyncReducerGeneratorFn<Q, R, R[]> = (state: AsyncStore<R[]>, request: Q, response: R) => {
		const store = state.store ? [...state.store, response] : [response]
		return { ...state, failure: false, working: false, completed: true, store }
	}
	return asyncReducerGenerator<T, Q, R, R[]>(t, defaultStartReducerFn<Q, R, R[]>(), successFn, defaultFailureReducerFn<Q, R, R[]>())
}

export const arrayAsyncLoadReducerGenerator: AsyncReducerGenerator = <T, Q, R>(t: T) => {
	const successFn: AsyncReducerGeneratorFn<Q, R[], R[]> = (state: AsyncStore<R[]>, request: Q, response: R[]) => {
		return { ...state, failure: false, working: false, completed: true, store: response }
	}
	return asyncReducerGenerator<T, Q, R[], R[]>(t, defaultStartReducerFn<Q, R[], R[]>(), successFn, defaultFailureReducerFn<Q, R[], R[]>())
}

export const arrayAsyncUpdateReducerGenerator: AsyncReducerGenerator = <T, R>(t?: T) => {

	const successFn: AsyncReducerGeneratorFn<R, R, R[]> = (state: AsyncStore<R[]>, response: R, request: R) => {
		const store: R[] = [
			...state.store.slice(0, state.store.indexOf(request)),
			response,
			...state.store.slice(state.store.indexOf(request) + 1, state.store.length),
		]
		return { ...state, failure: false, working: false, completed: true, store }
	}

	return asyncReducerGenerator<T, R, R, R[]>(t, defaultStartReducerFn<R, R, R[]>(), successFn, defaultFailureReducerFn<R, R, R[]>())
}

export const arrayAsyncDeleteReducerGenerator: AsyncReducerGenerator = <T, R>(t?: T) => {
	const successFn: AsyncReducerGeneratorFn<R, any, R[]> = (state: AsyncStore<R[]>, request: R, response: any) => {
		const store: R[] = [
			...state.store.slice(0, state.store.indexOf(request)),
			...state.store.slice(state.store.indexOf(request) + 1, state.store.length),
		]
		return { ...state, failure: false, working: false, store }
	}
	return asyncReducerGenerator<T, R, any, R[]>(t, defaultStartReducerFn<R, R, R[]>(), successFn, defaultFailureReducerFn<R, R, R[]>())
}

export const createReducer = (syncReducers?: SyncReducer<any, any, any>[], asyncReducers?: (AsyncReducer<any, any, any, any>[])) => {
	return (state: AsyncStore<any> | SimpleStore<any>, action: AsyncAction<any, any, any> | SimpleAction<any, any>) => {
		// We invoke all the sync reducer
		syncReducers && syncReducers.forEach((reducer) => {
			// After each reducer new state will be assigned to state object
			state = reducer(state, action)
		})

		asyncReducers && asyncReducers.forEach((reducer) => {
			// If state is not AsynStore we should not invoke async reducers
			if (state.hasOwnProperty('working')) {
				// If it has working property at root level state is AsynStore
				state = reducer(state as AsyncStore<any>, action as AsyncAction<any, any, any>)
			} else {
				// We log the error, don't
				console.error('State is not AsyncStore', state)
			}
		})
		return state
	}
}
