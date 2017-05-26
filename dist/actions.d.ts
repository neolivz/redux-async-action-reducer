export declare type STARTED = 'STARTED';
export declare const STARTED = "STARTED";
export declare type SUCCESS = 'SUCCESS';
export declare const SUCCESS = "SUCCESS";
export declare type FAILURE = 'FAILURE';
export declare const FAILURE = "FAILURE";
export declare type ActionRequest<Q> = {
    request: Q;
};
export declare type ActionResponse<R> = {
    response: R;
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
export declare type SimpleAction<T, Q> = ActionType<T> | (ActionType<T> & ActionRequest<Q>);
export declare type ActionSuccess<T, Q, R> = ActionStatusSuccess & ActionType<T> & ActionRequest<Q> & ActionResponse<R>;
export declare type ActionFailure<T, Q> = ActionStatusFailure & ActionType<T> & ActionRequest<Q> & ActionError;
export declare type ActionStarted<T, Q> = ActionStatusStarted & ActionType<T> & ActionRequest<Q>;
export declare type AsyncAction<T, Q, R> = ActionSuccess<T, Q, R> | ActionFailure<T, Q> | ActionStarted<T, Q>;
export interface ApiActionGroup<T, Q, R> {
    request: (q?: Q) => ActionStarted<T, Q>;
    success: (s: R, q?: Q) => ActionSuccess<T, Q, R>;
    error: (e: Error, q?: Q) => ActionFailure<T, Q>;
}
export interface Dispatch<T, Q, R> {
    <A extends AsyncAction<T, Q, R>>(action: A): A;
}
export interface Dispatcher<T, Q, R> {
    (dispatch: Dispatch<T, Q, R>): Promise<R>;
}
export interface AsyncActionCreatorReponse<T, Q, R> {
    (request?: Q): Dispatcher<T, Q, R>;
}
export interface SimpleActionCreatorResponse<T, Q> {
    (request?: Q): SimpleAction<T, Q>;
}
export interface ApiFunc<Q, R> {
    (q?: Q): Promise<R>;
}
export interface AsynActionCreator<T, Q, R> {
    (t: T, fn: ApiFunc<Q, R>): AsyncActionCreatorReponse<T, Q, R>;
}
export interface SimpleActionCreator<T, Q> {
    (t: T): SimpleActionCreatorResponse<T, Q>;
}
export declare function apiActionGroupCreator<T, Q, R>(type: T): ApiActionGroup<T, Q, R>;
export declare function apiActionGroupFactory<T, Q, R>(ag: ApiActionGroup<T, Q, R>, go: ApiFunc<Q, R>): AsyncActionCreatorReponse<T, Q, R>;
export declare function createAsyncAction<T, Q, R>(t: T, go: ApiFunc<Q, R>): AsyncActionCreatorReponse<T, Q, R>;
export declare function createSimpleAction<T, Q>(type: T): SimpleActionCreatorResponse<T, Q>;
declare const _default: {
    createAsyncAction: <T, Q, R>(t: T, go: ApiFunc<Q, R>) => AsyncActionCreatorReponse<T, Q, R>;
    createSimpleAction: <T, Q>(type: T) => SimpleActionCreatorResponse<T, Q>;
};
export default _default;
