"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("./actions");
exports.initialState = {
    failure: false,
    working: false,
    completed: false,
    store: undefined,
};
exports.initialActiveState = Object.assign({}, exports.initialState, { open: false });
function defaultSyncReducerFn() {
    const fn = (state) => {
        return state;
    };
    return fn;
}
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
exports.syncReducerGenerator = (type, fn) => {
    return (state, action) => {
        if (type !== action.type) {
            return state;
        }
        else {
            return fn(state, action.request);
        }
    };
};
exports.asyncReducerGenerator = (type, startFn = defaultStartReducerFn(), successFn = defaultSuccessReducerFn(), failureFn = defaultFailureReducerFn()) => {
    return (state, action) => {
        // If type is undefined we invoke it for every action
        if (type !== action.type && typeof (type) !== 'undefined') {
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
    const successFn = (state, response, request) => {
        const store = [
            ...state.store.slice(0, state.store.indexOf(request)),
            response,
            ...state.store.slice(state.store.indexOf(request) + 1, state.store.length),
        ];
        return Object.assign({}, state, { failure: false, working: false, completed: true, store });
    };
    return exports.asyncReducerGenerator(t, defaultStartReducerFn(), successFn, defaultFailureReducerFn());
};
exports.arrayAsyncDeleteReducerGenerator = (t) => {
    const successFn = (state, request, response) => {
        const store = [
            ...state.store.slice(0, state.store.indexOf(request)),
            ...state.store.slice(state.store.indexOf(request) + 1, state.store.length),
        ];
        return Object.assign({}, state, { failure: false, working: false, store });
    };
    return exports.asyncReducerGenerator(t, defaultStartReducerFn(), successFn, defaultFailureReducerFn());
};
exports.createReducer = (syncReducers, asyncReducers) => {
    return (state, action) => {
        // We invoke all the sync reducer
        syncReducers && syncReducers.forEach((reducer) => {
            // After each reducer new state will be assigned to state object
            state = reducer(state, action);
        });
        asyncReducers && asyncReducers.forEach((reducer) => {
            // If state is not AsynStore we should not invoke async reducers
            if (state.hasOwnProperty('working')) {
                // If it has working property at root level state is AsynStore
                state = reducer(state, action);
            }
            else {
                // We log the error, don't
                console.error('State is not AsyncStore', state);
            }
        });
        return state;
    };
};
//# sourceMappingURL=reducers.js.map