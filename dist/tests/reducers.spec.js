"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../actions");
const reducers_1 = require("../reducers");
describe('Asyn Reducer Generator : start success fail functions should be invoked and return corresponding values', () => {
    let startFn = jest.fn((state) => state);
    let successFn = jest.fn((state) => state);
    let failureFn = jest.fn((state) => state);
    let reducer;
    beforeEach(() => {
        startFn = jest.fn((state) => state);
        successFn = jest.fn((state) => state);
        failureFn = jest.fn((state) => state);
        reducer = reducers_1.asyncReducerGenerator('ANY', startFn, successFn, failureFn);
    });
    it('should return the same state', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: actions_1.STARTED }) === reducers_1.initialState).toEqual(true);
        expect(reducer(reducers_1.initialActiveState, { type: 'ANY', request: undefined, status: actions_1.STARTED }) === reducers_1.initialActiveState).toEqual(true);
    });
    it('should not invoke any mock when type is diffrent', () => {
        reducer(reducers_1.initialState, { type: 'WRONG_TYPE', request: undefined, status: actions_1.STARTED });
        expect(startFn.mock.calls.length).toBe(0);
        expect(successFn.mock.calls.length).toBe(0);
        expect(failureFn.mock.calls.length).toBe(0);
    });
    it('should call only start mock when status is STARTED', () => {
        reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: actions_1.STARTED });
        expect(startFn.mock.calls.length).toBe(1);
        expect(successFn.mock.calls.length).toBe(0);
        expect(failureFn.mock.calls.length).toBe(0);
    });
    it('should call only success mock when status is SUCCESS', () => {
        reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: actions_1.SUCCESS, response: 'Whola' });
        expect(startFn.mock.calls.length).toBe(0);
        expect(successFn.mock.calls.length).toBe(1);
        expect(failureFn.mock.calls.length).toBe(0);
    });
    it('should call only failure mock when status is FAILURE', () => {
        reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: actions_1.FAILURE, error: new Error('Error') });
        expect(startFn.mock.calls.length).toBe(0);
        expect(successFn.mock.calls.length).toBe(0);
        expect(failureFn.mock.calls.length).toBe(1);
    });
    it('should return current state if invalid status is passed', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY' }) === reducers_1.initialState).toBe(true);
        expect(startFn.mock.calls.length).toBe(0);
        expect(successFn.mock.calls.length).toBe(0);
        expect(failureFn.mock.calls.length).toBe(0);
    });
});
describe('Asyn Reducer Generator Fn', () => {
    let startFn = (state, request) => (Object.assign({}, state, { working: true, completed: false, failure: false }));
    let successFn = (state, request, response) => (Object.assign({}, state, { working: false, completed: true, failure: false, store: response }));
    let failureFn = (state, request, response, error) => (Object.assign({}, state, { working: false, completed: false, failure: true, error }));
    let reducer;
    beforeEach(() => {
        reducer = reducers_1.asyncReducerGenerator('ANY', startFn, successFn, failureFn);
    });
    it('should get start fn output', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'STARTED' })).toEqual(Object.assign({}, reducers_1.initialState, { working: true, completed: false, failure: false }));
    });
    it('should get success fn output', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response' })).toEqual(Object.assign({}, reducers_1.initialState, { working: false, completed: true, failure: false, store: 'Response' }));
    });
    it('should get failure fn output', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toEqual(Object.assign({}, reducers_1.initialState, { working: false, completed: false, failure: true, error: Error('Fail') }));
    });
});
describe('Asyn Reducer Generator Fn With optional functions', () => {
    let failureFn = (state, request, response, error) => (Object.assign({}, state, { working: false, completed: false, failure: true, error }));
    let reducer;
    beforeEach(() => {
        reducer = reducers_1.asyncReducerGenerator('ANY', undefined, undefined, failureFn);
    });
    it('should get start fn output', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'STARTED' })).toMatchObject(Object.assign({}, reducers_1.initialState, { working: true, completed: false, failure: false }));
    });
    it('should get success fn output', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response' })).toMatchObject(Object.assign({}, reducers_1.initialState, { working: false, completed: true, failure: false, store: 'Response' }));
    });
    it('should get failure fn output', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toEqual(Object.assign({}, reducers_1.initialState, { working: false, completed: false, failure: true, error: Error('Fail') }));
    });
});
describe('Simple Async Reducer Generator Fn', () => {
    let reducer;
    beforeEach(() => {
        reducer = reducers_1.simpleAsyncReducerGenerator('ANY');
    });
    it('should get start fn output', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'STARTED' })).toMatchObject(Object.assign({}, reducers_1.initialState, { working: true, completed: false, failure: false }));
    });
    it('should get success fn output', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response' })).toMatchObject(Object.assign({}, reducers_1.initialState, { working: false, completed: true, failure: false, store: 'Response' }));
    });
    it('should get failure fn output', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toMatchObject(Object.assign({}, reducers_1.initialState, { working: false, completed: false, failure: true, error: Error('Fail') }));
    });
});
describe('Async Array Reducer: Create', () => {
    let reducer;
    beforeEach(() => {
        reducer = reducers_1.arrayAsyncCreateReducerGenerator('ANY');
    });
    it('should get start fn output', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'STARTED' })).toMatchObject(Object.assign({}, reducers_1.initialState, { working: true, completed: false, failure: false }));
    });
    it('should get success fn output', () => {
        const tempStore = reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response1' });
        expect(tempStore).toMatchObject(Object.assign({}, reducers_1.initialState, { working: false, completed: true, failure: false, store: ['Response1'] }));
        expect(reducer(tempStore, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response2' })).toMatchObject(Object.assign({}, reducers_1.initialState, { working: false, completed: true, failure: false, store: ['Response1', 'Response2'] }));
    });
    it('should get failure fn output', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toMatchObject(Object.assign({}, reducers_1.initialState, { working: false, completed: false, failure: true, error: Error('Fail') }));
    });
});
describe('Async Array Reducer: Read/Load', () => {
    let reducer;
    beforeEach(() => {
        reducer = reducers_1.arrayAsyncLoadReducerGenerator('ANY');
    });
    it('should get start fn output', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'STARTED' })).toMatchObject(Object.assign({}, reducers_1.initialState, { working: true, completed: false, failure: false }));
    });
    it('should get success fn output', () => {
        const tempStore = reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: ['Response1', 'Response2'] });
        expect(tempStore).toMatchObject(Object.assign({}, reducers_1.initialState, { working: false, completed: true, failure: false, store: ['Response1', 'Response2'] }));
        expect(reducer(tempStore, { type: 'ANY', request: undefined, status: 'SUCCESS', response: ['Response2'] })).toMatchObject(Object.assign({}, reducers_1.initialState, { working: false, completed: true, failure: false, store: ['Response2'] }));
    });
    it('should get failure fn output', () => {
        expect(reducer(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toMatchObject(Object.assign({}, reducers_1.initialState, { working: false, completed: false, failure: true, error: Error('Fail') }));
    });
});
describe('Async Array Reducer: Delete', () => {
    let reducer;
    const store = ['Response1', 'Response2', 'Response3'];
    let tempStore = reducers_1.arrayAsyncLoadReducerGenerator('ANY')(reducers_1.initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: store });
    beforeEach(() => {
        reducer = reducers_1.arrayAsyncDeleteReducerGenerator('ANY');
    });
    it('should get start fn output', () => {
        expect(reducer(tempStore, { type: 'ANY', request: undefined, status: 'STARTED' })).toMatchObject(Object.assign({}, tempStore, { working: true, completed: false, failure: false, store }));
    });
    it('should get success fn output', () => {
        expect(reducer(tempStore, { type: 'ANY', request: 'Response2', status: 'SUCCESS', response: '' })).toMatchObject(Object.assign({}, reducers_1.initialState, { working: false, completed: true, failure: false, store: ['Response1', 'Response3'] }));
    });
    it('should get failure fn output', () => {
        expect(reducer(tempStore, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })).toMatchObject(Object.assign({}, reducers_1.initialState, { working: false, completed: false, failure: true, store, error: Error('Fail') }));
    });
});
//# sourceMappingURL=reducers.spec.js.map