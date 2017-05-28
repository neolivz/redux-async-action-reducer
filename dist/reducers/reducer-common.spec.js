"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reducer_common_1 = require("./reducer-common");
const async_reducer_1 = require("./async-reducer");
describe('Should Reducer Execute', () => {
    it('Should be true if called with undefined type', () => {
        expect(reducer_common_1.shouldReducerExecute(undefined, { type: 'ANY' })).toBe(true);
    });
    it('Should be true if called with same type', () => {
        expect(reducer_common_1.shouldReducerExecute('ANY', { type: 'ANY' })).toBe(true);
    });
    it('Should be false if called with different type', () => {
        expect(reducer_common_1.shouldReducerExecute('NOT_ANY', { type: 'ANY' })).toBe(false);
    });
    it('Should be true if type array contains same type', () => {
        expect(reducer_common_1.shouldReducerExecute(['ANY', 'NOT_ANY'], { type: 'ANY' })).toBe(true);
    });
    it('Should be false if type array does not contain same type', () => {
        expect(reducer_common_1.shouldReducerExecute(['SOME_TYPE', 'NOT_ANY'], { type: 'ANY' })).toBe(false);
    });
});
describe('Empty Create reducer', () => {
    const emptyReducer = reducer_common_1.createReducer();
    it('Should return state as is with any action', () => {
        const myStore = { store: 'myStore' };
        expect(emptyReducer(myStore, { type: 'ANY' })).toEqual(myStore);
    });
});
describe('Create only with sync reducer', () => {
    const s1 = jest.fn((state, action) => state);
    const s2 = jest.fn((state, action) => state);
    const syncReducers = [s1, s1, s2];
    const syncCreateReducer = reducer_common_1.createReducer(syncReducers);
    it('Should return state as is with any action and invoke sync reducers', () => {
        expect(syncCreateReducer(async_reducer_1.initialState, { type: 'ANY' })).toEqual(async_reducer_1.initialState);
        expect(s1.mock.calls.length).toBe(2); // as we have 2 times in sync reducer
        expect(s2.mock.calls.length).toBe(1);
        expect(s1.mock.calls[0]).toEqual([async_reducer_1.initialState, { type: 'ANY' }]);
        expect(s1.mock.calls[1]).toEqual([async_reducer_1.initialState, { type: 'ANY' }]);
        expect(s2.mock.calls[0]).toEqual([async_reducer_1.initialState, { type: 'ANY' }]);
    });
});
describe('Create only with async reducer', () => {
    const s1 = jest.fn((state, action) => state);
    const s2 = jest.fn((state, action) => state);
    const asyncReducers = [s1, s2, s1];
    const syncCreateReducer = reducer_common_1.createReducer(undefined, asyncReducers);
    it('Should return state as is with any action and invoke async reducers', () => {
        expect(syncCreateReducer(async_reducer_1.initialState, { type: 'ANY' })).toEqual(async_reducer_1.initialState);
        expect(s1.mock.calls.length).toBe(2); // as we have 2 times in sync reducer
        expect(s2.mock.calls.length).toBe(1);
        expect(s1.mock.calls[0]).toEqual([async_reducer_1.initialState, { type: 'ANY' }]);
        expect(s1.mock.calls[1]).toEqual([async_reducer_1.initialState, { type: 'ANY' }]);
        expect(s2.mock.calls[0]).toEqual([async_reducer_1.initialState, { type: 'ANY' }]);
    });
});
describe('Create  with both sync and async reducer', () => {
    const s1 = jest.fn((state, action) => state);
    const s2 = jest.fn((state, action) => state);
    const syncReducers = [s1, s1];
    const asyncReducers = [s2];
    const syncCreateReducer = reducer_common_1.createReducer(syncReducers, asyncReducers);
    it('Should return state as is with any action', () => {
        expect(syncCreateReducer(async_reducer_1.initialState, { type: 'ANY' })).toEqual(async_reducer_1.initialState);
        expect(s1.mock.calls.length).toBe(2); // as we have 2 times in sync reducer
        expect(s2.mock.calls.length).toBe(1);
        expect(s1.mock.calls[0]).toEqual([async_reducer_1.initialState, { type: 'ANY' }]);
        expect(s1.mock.calls[1]).toEqual([async_reducer_1.initialState, { type: 'ANY' }]);
        expect(s2.mock.calls[0]).toEqual([async_reducer_1.initialState, { type: 'ANY' }]);
    });
});
describe('Create  with both sync and async reducer with state change', () => {
    const s1 = jest.fn((state, action) => (Object.assign({}, state, { store: 0 })));
    const s2 = jest.fn((state, action) => (Object.assign({}, state, { store: 1 })));
    const as1 = jest.fn((state, action) => (Object.assign({}, state, { store: 2 })));
    const as2 = jest.fn((state, action) => (Object.assign({}, state, { store: 3 })));
    const syncReducers = [s1, s2];
    const asyncReducers = [as1, as2];
    const syncCreateReducer = reducer_common_1.createReducer(syncReducers, asyncReducers);
    it('Should return state as is with any action', () => {
        expect(syncCreateReducer(async_reducer_1.initialState, { type: 'ANY' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: 3 }));
        expect(s1.mock.calls.length).toBe(1); // as we have 2 times in sync reducer
        expect(s2.mock.calls.length).toBe(1);
        expect(as1.mock.calls.length).toBe(1);
        expect(as2.mock.calls.length).toBe(1);
        expect(s1.mock.calls[0]).toEqual([Object.assign({}, async_reducer_1.initialState), { type: 'ANY' }]);
        expect(s2.mock.calls[0]).toEqual([Object.assign({}, async_reducer_1.initialState, { store: 0 }), { type: 'ANY' }]);
        expect(as1.mock.calls[0]).toEqual([Object.assign({}, async_reducer_1.initialState, { store: 1 }), { type: 'ANY' }]);
        expect(as2.mock.calls[0]).toEqual([Object.assign({}, async_reducer_1.initialState, { store: 2 }), { type: 'ANY' }]);
    });
});
describe('Create  with both sync and async reducer with non async state', () => {
    const s1 = jest.fn((state, action) => (Object.assign({}, state, { store: 0 })));
    const s2 = jest.fn((state, action) => (Object.assign({}, state, { store: 1 })));
    const as1 = jest.fn((state, action) => (Object.assign({}, state, { store: 2 })));
    const as2 = jest.fn((state, action) => (Object.assign({}, state, { store: 3 })));
    const syncReducers = [s1, s2];
    const asyncReducers = [as1, as2];
    const syncCreateReducer = reducer_common_1.createReducer(syncReducers, asyncReducers);
    it('Should return state as is with any action', () => {
        expect(syncCreateReducer({ store: 0 }, { type: 'ANY' })).toEqual({ store: 1 });
        expect(s1.mock.calls.length).toBe(1); // as we have 2 times in sync reducer
        expect(s2.mock.calls.length).toBe(1);
        expect(as1.mock.calls.length).toBe(0);
        expect(as2.mock.calls.length).toBe(0);
    });
});
//# sourceMappingURL=reducer-common.spec.js.map