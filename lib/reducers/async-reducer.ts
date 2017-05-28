import { AsyncAction, STARTED, SUCCESS, FAILURE } from '../actions'
import { SimpleStore, ArrayStore, shouldReducerExecute } from './reducer-common'

export interface AsyncComponent {
	working: boolean
	failure: boolean
	completed: boolean
	startedDate?: Date,
	finishedDate?: Date,
	error?: Error,
}

export interface AsyncStore<S> extends AsyncComponent, SimpleStore<S> { }

export interface AsyncArrayStore<S> extends AsyncComponent, ArrayStore<S> { }

export interface AsyncReducer<T, Q, R, S> {
	(state: AsyncStore<S>, action: AsyncAction<T, Q, R>): AsyncStore<S>
}

export interface AsyncReducerGeneratorFn<Q, R, S> {
	(state: AsyncStore<S>, request?: Q, response?: R, error?: Error): AsyncStore<S>
}

export interface AsyncReducerGenerator {
	<T, Q, R, S>(
		type?: T,
		startFn?: AsyncReducerGeneratorFn<Q, R, S>,
		successFn?: AsyncReducerGeneratorFn<Q, R, S>,
		failureFn?: AsyncReducerGeneratorFn<Q, R, S>)
		: AsyncReducer<T, Q, R, S>
}

export const initialState: AsyncStore<any> = {
	failure: false,
	working: false,
	completed: false,
	store: undefined,
}

export const isAsyncStore = (store: any): store is AsyncStore<any> => {
	return typeof (store) !== 'undefined' && store.hasOwnProperty('working')
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

export const asyncReducerGenerator: AsyncReducerGenerator = <T, Q, R, S>(
	type: T | T[] | undefined,
	startFn: AsyncReducerGeneratorFn<Q, R, S> = defaultStartReducerFn<Q, R, S>(),
	successFn: AsyncReducerGeneratorFn<Q, R, S> = defaultSuccessReducerFn<Q, R, S>(),
	failureFn: AsyncReducerGeneratorFn<Q, R, S> = defaultFailureReducerFn<Q, R, S>()) => {
	return (state: AsyncStore<S>, action: AsyncAction<T, Q, R>): AsyncStore<S> => {
		// If type is undefined we invoke it for every action
		if (!shouldReducerExecute(type, action)) {
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

	const successFn: AsyncReducerGeneratorFn<R[], R, R[]> = (state: AsyncStore<R[]>, request: R[], response: R) => {
		// if the entry not found we don't update anything
		const store: R[] = state.store.indexOf(request[0]) > -1 ? [
			...state.store.slice(0, state.store.indexOf(request[0])),
			response,
			...state.store.slice(state.store.indexOf(request[0]) + 1, state.store.length),
		] : state.store
		return { ...state, failure: false, working: false, completed: true, store }
	}

	return asyncReducerGenerator<T, R[], R, R[]>(t, defaultStartReducerFn<R[], R, R[]>(), successFn, defaultFailureReducerFn<R[], R, R[]>())
}

export const arrayAsyncDeleteReducerGenerator: AsyncReducerGenerator = <T, R>(t?: T) => {
	const successFn: AsyncReducerGeneratorFn<R, any, R[]> = (state: AsyncStore<R[]>, request: R, response: any) => {
		// If the entry is not found we don't delete anything
		const store: R[] = state.store.indexOf(request) > -1 ? [
			...state.store.slice(0, state.store.indexOf(request)),
			...state.store.slice(state.store.indexOf(request) + 1, state.store.length),
		] : state.store
		return { ...state, failure: false, working: false, store }
	}
	return asyncReducerGenerator<T, R, any, R[]>(t, defaultStartReducerFn<R, R, R[]>(), successFn, defaultFailureReducerFn<R, R, R[]>())
}
