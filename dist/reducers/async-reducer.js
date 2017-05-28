"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../actions");
const reducer_common_1 = require("./reducer-common");
exports.initialState = {
    failure: false,
    working: false,
    completed: false,
    store: undefined,
};
exports.isAsyncStore = (store) => {
    return typeof (store) !== 'undefined' && store.hasOwnProperty('working');
};
function defaultStartReducerFn() {
    const startFn = (state) => {
        return Object.assign({}, state, { failure: false, working: true, completed: false, started: new Date(), finished: undefined });
    };
    return startFn;
}
function defaultSuccessReducerFn() {
    const successFn = (state, request, response) => {
        return Object.assign({}, state, { failure: false, working: false, completed: true, store: response, finished: new Date() });
    };
    return successFn;
}
function defaultFailureReducerFn() {
    const failureFn = (state, request, response, error) => {
        return Object.assign({}, state, { failure: true, working: false, completed: false, finished: new Date(), error });
    };
    return failureFn;
}
exports.asyncReducerGenerator = (type, startFn = defaultStartReducerFn(), successFn = defaultSuccessReducerFn(), failureFn = defaultFailureReducerFn()) => {
    return (state, action) => {
        // If type is undefined we invoke it for every action
        if (!reducer_common_1.shouldReducerExecute(type, action)) {
            return state;
        }
        else if (action.status === actions_1.STARTED) {
            return startFn(state, action.request);
        }
        else if (action.status === actions_1.SUCCESS) {
            return successFn(state, action.request, action.response);
        }
        else if (action.status === actions_1.FAILURE) {
            return failureFn(state, action.request, undefined, action.error);
        }
        return state;
    };
};
exports.simpleAsyncReducerGenerator = (t) => {
    return exports.asyncReducerGenerator(t, defaultStartReducerFn(), defaultSuccessReducerFn(), defaultFailureReducerFn());
};
exports.arrayAsyncCreateReducerGenerator = (t) => {
    const successFn = (state, request, response) => {
        const store = state.store ? [...state.store, response] : [response];
        return Object.assign({}, state, { failure: false, working: false, completed: true, store });
    };
    return exports.asyncReducerGenerator(t, defaultStartReducerFn(), successFn, defaultFailureReducerFn());
};
exports.arrayAsyncLoadReducerGenerator = (t) => {
    const successFn = (state, request, response) => {
        return Object.assign({}, state, { failure: false, working: false, completed: true, store: response });
    };
    return exports.asyncReducerGenerator(t, defaultStartReducerFn(), successFn, defaultFailureReducerFn());
};
exports.arrayAsyncUpdateReducerGenerator = (t) => {
    const successFn = (state, request, response) => {
        // if the entry not found we don't update anything
        const store = state.store.indexOf(request[0]) > -1 ? [
            ...state.store.slice(0, state.store.indexOf(request[0])),
            response,
            ...state.store.slice(state.store.indexOf(request[0]) + 1, state.store.length),
        ] : state.store;
        return Object.assign({}, state, { failure: false, working: false, completed: true, store });
    };
    return exports.asyncReducerGenerator(t, defaultStartReducerFn(), successFn, defaultFailureReducerFn());
};
exports.arrayAsyncDeleteReducerGenerator = (t) => {
    const successFn = (state, request, response) => {
        // If the entry is not found we don't delete anything
        const store = state.store.indexOf(request) > -1 ? [
            ...state.store.slice(0, state.store.indexOf(request)),
            ...state.store.slice(state.store.indexOf(request) + 1, state.store.length),
        ] : state.store;
        return Object.assign({}, state, { failure: false, working: false, store });
    };
    return exports.asyncReducerGenerator(t, defaultStartReducerFn(), successFn, defaultFailureReducerFn());
};
//# sourceMappingURL=async-reducer.js.map