"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_reducer_1 = require("./async-reducer");
function shouldReducerExecute(type, action) {
    // if type is an array and action type exists in the array it should execute
    // if type is string and exactly matching with action type
    // if type is undefined, i.e. optional
    return (Array.isArray(type) && type.indexOf(action.type) > -1)
        || (typeof (type) === 'string' && type === action.type)
        || (typeof (type) === 'undefined');
}
exports.shouldReducerExecute = shouldReducerExecute;
exports.createReducer = (syncReducers, asyncReducers) => {
    return (state, action) => {
        // We invoke all the sync reducer
        syncReducers && syncReducers.forEach((reducer) => {
            // After each reducer new state will be assigned to state object
            state = reducer(state, action);
        });
        asyncReducers && asyncReducers.forEach((reducer) => {
            // If state is not AsyncStore we should not invoke async reducers
            if (async_reducer_1.isAsyncStore(state)) {
                // If it has working property at root level state is AsyncStore
                state = reducer(state, action);
            }
        });
        return state;
    };
};
//# sourceMappingURL=reducer-common.js.map