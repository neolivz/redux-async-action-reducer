"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STARTED = 'STARTED';
exports.SUCCESS = 'SUCCESS';
exports.FAILURE = 'FAILURE';
function apiActionGroupCreator(type) {
    return {
        request: (request) => ({ type, status: exports.STARTED, request, }),
        success: (response, request) => ({ type, status: exports.SUCCESS, request, response }),
        error: (error, request) => ({ type, status: exports.FAILURE, request, error }),
    };
}
exports.apiActionGroupCreator = apiActionGroupCreator;
// Factory to generate Async actions
// Expects ApiActionGroup<T,R,S> and ApiFunc<Q,S>
function apiActionGroupFactory(ag, go) {
    return (request) => (dispatch) => {
        dispatch(ag.request(request));
        return go(request)
            .then((response) => dispatch(ag.success(response, request)))
            .catch((e) => dispatch(ag.error(e, request)));
    };
}
exports.apiActionGroupFactory = apiActionGroupFactory;
function createAsyncAction(t, go) {
    return apiActionGroupFactory(apiActionGroupCreator(t), go);
}
exports.createAsyncAction = createAsyncAction;
function createSimpleAction(type) {
    return (request) => {
        if (request) {
            return { type, request };
        }
        else {
            return { type };
        }
    };
}
exports.createSimpleAction = createSimpleAction;
exports.default = {
    createAsyncAction,
    createSimpleAction
};
//# sourceMappingURL=actions.js.map