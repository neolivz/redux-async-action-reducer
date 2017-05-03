export declare type STARTED = 'STARTED';
export declare const STARTED = "STARTED";
export declare type SUCCESS = 'SUCCESS';
export declare const SUCCESS = "SUCCESS";
export declare type FAILURE = 'FAILURE';
export declare const FAILURE = "FAILURE";
export declare type ActionRequest<R> = {
    request: R;
};
export declare type ActionResponse<S> = {
    response: S;
};
export declare type ActionStatusStarted = {
    status: STARTED;
};
export declare type ActionStatusSuccess = {
    status: SUCCESS;
};
export declare type ActionStatusFailure = {
    status: FAILURE;
};
export declare type ActionError = {
    error: Error;
};
export declare type ActionType<T> = {
    type: T;
};
export declare type ActionSimple<T, R> = ActionType<T> & ActionRequest<R>;
export declare type ActionSuccess<T, R, S> = ActionStatusSuccess & ActionSimple<T, R> & ActionResponse<S>;
export declare type ActionFailure<T, R> = ActionStatusFailure & ActionSimple<T, R> & ActionError;
export declare type ActionStarted<T, R> = ActionStatusStarted & ActionSimple<T, R>;
export declare type AsyncAction<T, R, S> = ActionSuccess<T, R, S> | ActionFailure<T, R> | ActionStarted<T, R>;
export interface ApiActionGroup<T, R, S> {
    request: (q?: R) => ActionStarted<T, R>;
    success: (s: S, q?: R) => ActionSuccess<T, R, S>;
    error: (e: Error, q?: R) => ActionFailure<T, R>;
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
    (request?: R): ActionSimple<T, R>;
}
export interface ApiFunc<R, S> {
    (q: R): Promise<S>;
}
export interface AsynActionCreator<T, R, S> {
    (t: T, fn: ApiFunc<R, S>): AsyncActionCreatorReponse<T, R, S>;
}
export interface SimpleActionCreator<T, R> {
    (t: T): SimpleActionCreatorResponse<T, R>;
}
export declare function apiActionGroupCreator<T, R, S>(type: T): ApiActionGroup<T, R, S>;
export declare function apiActionGroupFactory<T, R, S>(ag: ApiActionGroup<T, R, S>, go: ApiFunc<R, S>): AsyncActionCreatorReponse<T, R, S>;
export declare function createAsyncAction<T, R, S>(t: T, go: ApiFunc<R, S>): AsyncActionCreatorReponse<T, R, S>;
export declare function createSimpleAction<T, R>(type: T): SimpleActionCreatorResponse<T, R>;
