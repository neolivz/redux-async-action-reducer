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
exports.asyncReducerGenerator = (type, startFn = defaultStartReducerFn(), successFn, failureFn) => {
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
        return Object.assign({}, state, { failure: false, working: false, store: [...state.store, response] });
    };
    return exports.asyncReducerGenerator(t, defaultStartReducerFn(), successFn, defaultFailureReducerFn());
};
exports.arrayAsyncLoadReducerGenerator = (t) => {
    const successFn = (state, request, response) => {
        return Object.assign({}, state, { failure: false, working: false, store: response });
    };
    return exports.asyncReducerGenerator(t, defaultStartReducerFn(), successFn, defaultFailureReducerFn());
};
exports.arrayAsyncUpdateReducerGenerator = () => {
    const successFn = (state, response, request) => {
        const store = [
            ...state.store.slice(0, state.store.indexOf(request)),
            response,
            ...state.store.slice(state.store.indexOf(request) + 1, state.store.length),
        ];
        return Object.assign({}, state, { failure: false, working: false, store });
    };
    return exports.asyncReducerGenerator(defaultStartReducerFn(), successFn, defaultFailureReducerFn());
};
exports.arrayAsyncDeleteReducerGenerator = () => {
    const successFn = (state, response, request) => {
        const store = [
            ...state.store.slice(0, state.store.indexOf(request)),
            ...state.store.slice(state.store.indexOf(request) + 1, state.store.length),
        ];
        return Object.assign({}, state, { failure: false, working: false, store });
    };
    return exports.asyncReducerGenerator(defaultStartReducerFn(), successFn, defaultFailureReducerFn());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlcnMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3Zpc3dhbmFqL1dvcmsvUm5EL3JlZHV4LWFzeW5jLWFjdGlvbi1yZWR1Y2VyL2xpYi8iLCJzb3VyY2VzIjpbInJlZHVjZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQWdGO0FBa0NuRSxRQUFBLFlBQVksR0FBb0I7SUFDNUMsT0FBTyxFQUFFLEtBQUs7SUFDZCxPQUFPLEVBQUUsS0FBSztJQUNkLFNBQVMsRUFBRSxLQUFLO0lBQ2hCLEtBQUssRUFBRSxTQUFTO0NBQ2hCLENBQUE7QUFFWSxRQUFBLGtCQUFrQixxQkFBK0Isb0JBQVksSUFBRSxJQUFJLEVBQUUsS0FBSyxJQUFFO0FBK0J6RjtJQUNDLE1BQU0sRUFBRSxHQUFpQyxDQUFJLEtBQXFCO1FBQ2pFLE1BQU0sQ0FBQyxLQUFLLENBQUE7SUFDYixDQUFDLENBQUE7SUFDRCxNQUFNLENBQUMsRUFBRSxDQUFBO0FBQ1YsQ0FBQztBQUNEO0lBQ0MsTUFBTSxPQUFPLEdBQXFDLENBQUksS0FBb0I7UUFDekUsTUFBTSxtQkFBTSxLQUFLLElBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsSUFBRTtJQUMvRyxDQUFDLENBQUE7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFBO0FBQ2YsQ0FBQztBQUNEO0lBQ0MsTUFBTSxTQUFTLEdBQXFDLENBQUksS0FBb0IsRUFBRSxPQUFVLEVBQUUsUUFBVztRQUNwRyxNQUFNLG1CQUFNLEtBQUssSUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLElBQUksRUFBRSxJQUFFO0lBQzVHLENBQUMsQ0FBQTtJQUNELE1BQU0s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