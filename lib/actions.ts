
export type STARTED = 'STARTED'
export const STARTED = 'STARTED'
export type SUCCESS = 'SUCCESS'
export const SUCCESS = 'SUCCESS'
export type FAILURE = 'FAILURE'
export const FAILURE = 'FAILURE'

// Generics in this page have convention of
// T -> Type,
// Q -> Query/reQuest,
// R -> Response
// S -> Store
// A -> Action

export type ActionRequest<Q> = { request: Q }
export type ActionResponse<R> = { response: R }
export type ActionStatusStarted = { status: STARTED }
export type ActionStatusSuccess = { status: SUCCESS }
export type ActionStatusFailure = { status: FAILURE }
export type ActionError = { error: Error }
export type ActionType<T> = { type: T }

export type SimpleAction<T, Q> = ActionType<T> | (ActionType<T> & ActionRequest<Q>)
export type ActionSuccess<T, Q, R> = ActionStatusSuccess & ActionType<T> & ActionRequest<Q> & ActionResponse<R>
export type ActionFailure<T, Q> = ActionStatusFailure & ActionType<T> & ActionRequest<Q> & ActionError
export type ActionStarted<T, Q> = ActionStatusStarted & ActionType<T> & ActionRequest<Q>
export type AsyncAction<T, Q, R> = ActionSuccess<T, Q, R> | ActionFailure<T, Q> | ActionStarted<T, Q>

export interface ApiActionGroup<T, Q, R> {
	request: (q?: Q) => ActionStarted<T, Q>
	success: (s: R, q?: Q) => ActionSuccess<T, Q, R>
	error: (e: Error, q?: Q) => ActionFailure<T, Q>
}

export interface Dispatch<T, Q, R> {
	<A extends AsyncAction<T, Q, R>>(action: A): A
}

export interface Dispatcher<T, Q, R> {
	(dispatch: Dispatch<T, Q, R>): Promise<R>
}

export interface AsyncActionCreatorReponse<T, Q, R> {
	(request?: Q): Dispatcher<T, Q, R>
}

export interface SimpleActionCreatorResponse<T, Q> {
	(request?: Q): SimpleAction<T, Q>
}

export interface ApiFunc<Q, R> {
	(q?: Q): Promise<R>
}

export interface AsynActionCreator<T, Q, R> {
	(t: T, fn: ApiFunc<Q, R>): AsyncActionCreatorReponse<T, Q, R>
}

export interface SimpleActionCreator<T, Q> {
	(t: T): SimpleActionCreatorResponse<T, Q>
}

export function apiActionGroupCreator<T, Q, R>(type: T): ApiActionGroup<T, Q, R> {
	return {
		request: (request: Q) =>
			({ type, status: STARTED, request, }),
		success: (response: R, request: Q) =>
			({ type, status: SUCCESS, request, response }),
		error: (error, request: Q) =>
			({ type, status: FAILURE, request, error }),
	}
}

// Factory to generate Async actions
// Expects ApiActionGroup<T,R,S> and ApiFunc<Q,S>
export function apiActionGroupFactory<T, Q, R>
	(ag: ApiActionGroup<T, Q, R>, go: ApiFunc<Q, R>): AsyncActionCreatorReponse<T, Q, R> {
	return (request?: Q) =>
		(dispatch: Dispatch<T, Q, R>): Promise<any> => {
			dispatch(ag.request(request))
			return go(request)
				.then((response) => dispatch(ag.success(response, request)))
				.catch((e: Error) => dispatch(ag.error(e, request)))
		}
}

export function createAsyncAction<T, Q, R>(t: T, go: ApiFunc<Q, R>): AsyncActionCreatorReponse<T, Q, R> {
	return apiActionGroupFactory(apiActionGroupCreator(t), go)
}

export function createSimpleAction<T, Q>(type: T): SimpleActionCreatorResponse<T, Q> {
	return (request?: Q) => {
		if (request) {
			return { type, request }
		} else {
			return { type }
		}
	}
}

export default {
	createAsyncAction,
	createSimpleAction
}
