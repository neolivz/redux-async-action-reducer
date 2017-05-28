"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../actions");
const async_reducer_1 = require("./async-reducer");
describe('Async Reducer Generator : start success fail functions should be invoked and return corresponding values', () => {
    let startFn = jest.fn((state) => state);
    let successFn = jest.fn((state) => state);
    let failureFn = jest.fn((state) => state);
    let reducer;
    beforeEach(() => {
        startFn = jest.fn((state) => state);
        successFn = jest.fn((state) => state);
        failureFn = jest.fn((state) => state);
        reducer = async_reducer_1.asyncReducerGenerator('ANY', startFn, successFn, failureFn);
    });
    it('should return the same state', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: actions_1.STARTED }) === async_reducer_1.initialState).toEqual(true);
    });
    it('should not invoke any mock when type is different', () => {
        reducer(async_reducer_1.initialState, { type: 'WRONG_TYPE', request: undefined, status: actions_1.STARTED });
        expect(startFn.mock.calls.length).toBe(0);
        expect(successFn.mock.calls.length).toBe(0);
        expect(failureFn.mock.calls.length).toBe(0);
    });
    it('should call only start mock when status is STARTED', () => {
        reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: actions_1.STARTED });
        expect(startFn.mock.calls.length).toBe(1);
        expect(successFn.mock.calls.length).toBe(0);
        expect(failureFn.mock.calls.length).toBe(0);
    });
    it('should call only success mock when status is SUCCESS', () => {
        reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: actions_1.SUCCESS, response: 'Whola' });
        expect(startFn.mock.calls.length).toBe(0);
        expect(successFn.mock.calls.length).toBe(1);
        expect(failureFn.mock.calls.length).toBe(0);
    });
    it('should call only failure mock when status is FAILURE', () => {
        reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: actions_1.FAILURE, error: new Error('Error') });
        expect(startFn.mock.calls.length).toBe(0);
        expect(successFn.mock.calls.length).toBe(0);
        expect(failureFn.mock.calls.length).toBe(1);
    });
    it('should return current state if invalid status is passed', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY' }) === async_reducer_1.initialState).toBe(true);
        expect(startFn.mock.calls.length).toBe(0);
        expect(successFn.mock.calls.length).toBe(0);
        expect(failureFn.mock.calls.length).toBe(0);
    });
});
describe('Async Reducer Generator Fn', () => {
    let startFn = (state, request) => (Object.assign({}, state, { working: true, completed: false, failure: false }));
    let successFn = (state, request, response) => (Object.assign({}, state, { working: false, completed: true, failure: false, store: response }));
    let failureFn = (state, request, response, error) => (Object.assign({}, state, { working: false, completed: false, failure: true, error }));
    let reducer;
    beforeEach(() => {
        reducer = async_reducer_1.asyncReducerGenerator('ANY', startFn, successFn, failureFn);
    });
    it('should get start fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'STARTED' })).toEqual(Object.assign({}, async_reducer_1.initialState, { working: true, completed: false, failure: false }));
    });
    it('should get success fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response' })).toEqual(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store: 'Response' }));
    });
    it('should get failure fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toEqual(Object.assign({}, async_reducer_1.initialState, { working: false, completed: false, failure: true, error: Error('Fail') }));
    });
});
describe('Async Reducer Generator Fn With Array Type', () => {
    let startFn = (state, request) => (Object.assign({}, state, { working: true, completed: false, failure: false }));
    let successFn = (state, request, response) => (Object.assign({}, state, { working: false, completed: true, failure: false, store: response }));
    let failureFn = (state, request, response, error) => (Object.assign({}, state, { working: false, completed: false, failure: true, error }));
    let reducer;
    beforeEach(() => {
        reducer = async_reducer_1.asyncReducerGenerator(['ANY', 'SOME'], startFn, successFn, failureFn);
    });
    it('should get start fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'STARTED' })).toEqual(Object.assign({}, async_reducer_1.initialState, { working: true, completed: false, failure: false }));
    });
    it('should get success fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'SOME', request: undefined, status: 'SUCCESS', response: 'Response' })).toEqual(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store: 'Response' }));
    });
    it('should get failure fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toEqual(Object.assign({}, async_reducer_1.initialState, { working: false, completed: false, failure: true, error: Error('Fail') }));
    });
});
describe('Async Reducer Generator Fn With undefined type', () => {
    let startFn = (state, request) => (Object.assign({}, state, { working: true, completed: false, failure: false }));
    let successFn = (state, request, response) => (Object.assign({}, state, { working: false, completed: true, failure: false, store: response }));
    let failureFn = (state, request, response, error) => (Object.assign({}, state, { working: false, completed: false, failure: true, error }));
    let reducer;
    beforeEach(() => {
        reducer = async_reducer_1.asyncReducerGenerator(undefined, startFn, successFn, failureFn);
    });
    it('should get start fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'STARTED' })).toEqual(Object.assign({}, async_reducer_1.initialState, { working: true, completed: false, failure: false }));
    });
    it('should get success fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'SOME', request: undefined, status: 'SUCCESS', response: 'Response' })).toEqual(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store: 'Response' }));
    });
    it('should get failure fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'WHATEVER', request: undefined, status: 'FAILURE', error: Error('Fail') })).toEqual(Object.assign({}, async_reducer_1.initialState, { working: false, completed: false, failure: true, error: Error('Fail') }));
    });
});
describe('Async Reducer Generator Fn With optional no arguments', () => {
    let reducer;
    beforeEach(() => {
        reducer = async_reducer_1.asyncReducerGenerator();
    });
    it('should get start fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'STARTED' })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: true, completed: false, failure: false }));
    });
    it('should get success fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response' })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store: 'Response' }));
    });
    it('should get failure fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: false, failure: true, error: Error('Fail') }));
    });
});
describe('Async Reducer Generator Fn With optional functions', () => {
    let failureFn = (state, request, response, error) => (Object.assign({}, state, { working: false, completed: false, failure: true, error }));
    let reducer;
    beforeEach(() => {
        reducer = async_reducer_1.asyncReducerGenerator('ANY', undefined, undefined, failureFn);
    });
    it('should get start fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'STARTED' })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: true, completed: false, failure: false }));
    });
    it('should get success fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response' })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store: 'Response' }));
    });
    it('should get failure fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toEqual(Object.assign({}, async_reducer_1.initialState, { working: false, completed: false, failure: true, error: Error('Fail') }));
    });
});
describe('Simple Async Reducer Generator Fn', () => {
    let reducer;
    beforeEach(() => {
        reducer = async_reducer_1.asyncReducer('ANY');
    });
    it('should get start fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'STARTED' })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: true, completed: false, failure: false }));
    });
    it('should get success fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response' })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store: 'Response' }));
    });
    it('should get failure fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: false, failure: true, error: Error('Fail') }));
    });
});
describe('Async Array Reducer: Create', () => {
    let reducer;
    beforeEach(() => {
        reducer = async_reducer_1.arrayAsyncCreateReducer('ANY');
    });
    it('should get start fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'STARTED' })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: true, completed: false, failure: false }));
    });
    it('should get success fn output', () => {
        const tempStore = reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response1' });
        expect(tempStore).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store: ['Response1'] }));
        expect(reducer(tempStore, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response2' })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store: ['Response1', 'Response2'] }));
    });
    it('should get failure fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: false, failure: true, error: Error('Fail') }));
    });
});
describe('Async Array Reducer: Read/Load', () => {
    let reducer;
    beforeEach(() => {
        reducer = async_reducer_1.arrayAsyncLoadReducer('ANY');
    });
    it('should get start fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'STARTED' })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: true, completed: false, failure: false }));
    });
    it('should get success fn output', () => {
        const tempStore = reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: ['Response1', 'Response2'] });
        expect(tempStore).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store: ['Response1', 'Response2'] }));
        expect(reducer(tempStore, { type: 'ANY', request: undefined, status: 'SUCCESS', response: ['Response2'] })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store: ['Response2'] }));
    });
    it('should get failure fn output', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: false, failure: true, error: Error('Fail') }));
    });
});
describe('Async Array Reducer: Delete', () => {
    let reducer;
    const store = ['Response1', 'Response2', 'Response3'];
    let tempStore = async_reducer_1.arrayAsyncLoadReducer('ANY')(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: store });
    beforeEach(() => {
        reducer = async_reducer_1.arrayAsyncDeleteReducer('ANY');
    });
    it('should get start fn output', () => {
        expect(reducer(tempStore, { type: 'ANY', request: undefined, status: 'STARTED' })).toMatchObject(Object.assign({}, tempStore, { working: true, completed: false, failure: false, store }));
    });
    it('should delete the entry', () => {
        expect(reducer(tempStore, { type: 'ANY', request: 'Response2', status: 'SUCCESS', response: '' })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store: ['Response1', 'Response3'] }));
    });
    it('should return as is if the entry is not availble', () => {
        expect(reducer(tempStore, { type: 'ANY', request: 'Response', status: 'SUCCESS', response: '' })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store }));
    });
    it('should get failure fn output', () => {
        expect(reducer(tempStore, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: false, failure: true, store, error: Error('Fail') }));
    });
});
describe('Async Array Update: Update', () => {
    let reducer;
    const store = ['Response1', 'Response2', 'Response3'];
    let tempStore = async_reducer_1.arrayAsyncLoadReducer('ANY')(async_reducer_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: store });
    beforeEach(() => {
        reducer = async_reducer_1.arrayAsyncUpdateReducer('ANY');
    });
    it('should get start fn output', () => {
        expect(reducer(tempStore, { type: 'ANY', request: ['Response2', undefined], status: 'STARTED' })).toMatchObject(Object.assign({}, tempStore, { working: true, completed: false, failure: false, store }));
    });
    it('should update the entry', () => {
        // if entry exists update
        expect(reducer(tempStore, { type: 'ANY', request: ['Response2', 'UpdatedResponse'], status: 'SUCCESS', response: 'UpdatedResponse' })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store: ['Response1', 'UpdatedResponse', 'Response3'] }));
        // if entry does not exist don't update anything
    });
    it('should return as is if the entry to be updated doesn\'t exist', () => {
        // if entry does not exist don't update anything
        expect(reducer(tempStore, { type: 'ANY', request: ['Response', 'UpdatedResponse'], status: 'SUCCESS', response: 'UpdatedResponse' })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: true, failure: false, store: ['Response1', 'Response2', 'Response3'] }));
    });
    it('should get failure fn output', () => {
        expect(reducer(tempStore, { type: 'ANY', request: ['Response1', 'UpdatedResponse'], status: 'FAILURE', error: Error('Fail') })).toMatchObject(Object.assign({}, async_reducer_1.initialState, { working: false, completed: false, failure: true, store, error: Error('Fail') }));
    });
});
//# sourceMappingURL=async-reducer.spec.js.map