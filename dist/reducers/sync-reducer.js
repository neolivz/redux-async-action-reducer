"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../actions");
const reducer_common_1 = require("./reducer-common");
const defaultSyncReducerFn = () => {
    return (state, request) => state;
};
exports.syncReducerGenerator = (type, fn = defaultSyncReducerFn()) => {
    return (state, action) => {
        if (!reducer_common_1.shouldReducerExecute(type, action)) {
            return state;
        }
        else {
            if (actions_1.hasActionRequest(action)) {
                return fn(state, action.request);
            }
            else {
                return fn(state);
            }
        }
    };
};
exports.syncReducer = (type) => {
    // INFO: We are wrapping in the store object for consistency
    // and generic spread (https://github.com/Microsoft/TypeScript/pull/13288) TS 2.4
    return exports.syncReducerGenerator(type, (state, query) => (Object.assign({}, state, { store: query })));
};
exports.arraySyncCreateReducerGenerator = (type) => {
    return exports.syncReducerGenerator(type, (state, query) => {
        return typeof (query) !== 'undefined' ? (state.store === undefined ? Object.assign({}, state, { store: [query] }) : Object.assign({}, state, { store: [...state.store, query] }))
            : state;
    });
};
exports.arraySyncLoadReducerGenerator = exports.syncReducer;
exports.arraySyncDeleteReducerGenerator = (type) => {
    return exports.syncReducerGenerator(type, (state, query) => {
        return typeof (query) === 'undefined'
            || !Array.isArray(state.store)
            || state.store.indexOf(query) === -1
            ? state : Object.assign({}, state, { store: [
                ...state.store.slice(0, state.store.indexOf(query)),
                ...state.store.slice(state.store.indexOf(query) + 1, state.store.length),
            ] });
    });
};
exports.arraySyncUpdateReducerGenerator = (type) => {
    const reducerGenFn = (state, query) => {
        // const newState = { ...state }
        // I guess another typescript bug,
        // so for the time being manual update
        // if (Array.isArray(query) && Array.isArray(newState.store)) {
        // 	if (newState.store.indexOf(query[0]) > -1) {
        // 		newState.store[newState.store.indexOf(query[0])] = query[1]
        // 	}
        // }
        // return newState
        return typeof (query) === 'undefined'
            || !Array.isArray(state.store)
            || !Array.isArray(query)
            || query.length !== 2
            || state.store.indexOf(query[0]) === -1
            ? state : Object.assign({}, state, { store: [
                ...state.store.slice(0, state.store.indexOf(query[0])),
                query[1],
                ...state.store.slice(state.store.indexOf(query[0]) + 1, state.store.length),
            ] });
    };
    return exports.syncReducerGenerator(type, reducerGenFn);
};
//# sourceMappingURL=sync-reducer.js.map