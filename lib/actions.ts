
export type STARTED = 'STARTED';
export const STARTED = 'STARTED';
export type SUCCESS = 'SUCCESS';
export const SUCCESS = 'SUCCESS';
export type FAILURE = 'FAILURE';
export const FAILURE = 'FAILURE';

//Generics in this page have convention of 
//T -> Type,
//R -> Request, 
//S -> reSponse

export type ActionRequest<R> = { request: R }
export type ActionResponse<S> = { response: S }
export type ActionStatusStarted = { status: STARTED };
export type ActionStatusSuccess = { status: SUCCESS };
export type ActionStatusFailure = { status: FAILURE };
export type ActionError = { error: Error }
export type ActionType<T> = { type: T }


export type ActionSimple<T, R> = ActionType<T> & ActionRequest<R>;
export type ActionSuccess<T, R, S> = ActionStatusSuccess & ActionSimple<T, R> & ActionResponse<S>;
export type ActionFailure<T, R> = ActionStatusFailure & ActionSimple<T, R> & ActionError;
export type ActionStarted<T, R> = ActionStatusStarted & ActionSimple<T, R>;
export type AsyncAction<T, R, S> = ActionSuccess<T, R, S> | ActionFailure<T, R> | ActionStarted<T, R>;


export interface ApiActionGroup<T, R, S> {
    request: (q?: R) => ActionStarted<T, R>
    success: (s: S, q?: R) => ActionSuccess<T, R, S>
    error: (e: Error, q?: R) => ActionFailure<T, R>
}

export interface Dispatch<T, R, S> {
    <A extends AsyncAction<T, R, S>>(action: A): A;
}

export interface Dispatcher<T, R, S> {
    (dispatch: Dispatch<T, R, S>): Promise<S>;
}

export interface AsyncActionCreatorReponse<T, R, S> {
    (request?: R): Dispatcher<T, R, S>;
}

export interface SimpleActionCreatorResponse<T, R> {
    (request?: R): ActionSimple<T, R>
}

export interface ApiFunc<R, S> {
    (q: R): Promise<S>
}

export interface AsynActionCreator<T, R, S> {
    (t: T, fn: ApiFunc<R, S>): AsyncActionCreatorReponse<T, R, S>
}

export interface SimpleActionCreator<T, R> {
    (t: T): SimpleActionCreatorResponse<T, R>
}

export function apiActionGroupCreator<T, R, S>(type: T): ApiActionGroup<T, R, S> {
    return {
        request: (request: R) =>
            ({ type, status: STARTED, request, }),
        success: (response: S, request: R) =>
            ({ type, status: SUCCESS, request, response }),
        error: (error, request: R) =>
            ({ type, status: FAILURE, request, error }),
    }
}

//Factory to generate Async actions
//Expects ApiActionGroup<T,R,S> and ApiFunc<R,S>
export function apiActionGroupFactory<T, R, S>
    (ag: ApiActionGroup<T, R, S>, go: ApiFunc<R, S>): AsyncActionCreatorReponse<T, R, S> {
    return (request?: R) =>
        (dispatch: Dispatch<T, R, S>): Promise<any> => {
            dispatch(ag.request(request));
            return go(request)
                .then((response) => dispatch(ag.success(response, request)))
                .catch((e: Error) => dispatch(ag.error(e, request)));
        }
}

export function createAsyncAction<T, R, S>(t: T, go: ApiFunc<R, S>): AsyncActionCreatorReponse<T, R, S> {
    return apiActionGroupFactory(apiActionGroupCreator(t), go)
}

export function createSimpleAction<T, R>(type: T): SimpleActionCreatorResponse<T, R> {
    return (request: R) => {
        return { type, request }
    }
}


