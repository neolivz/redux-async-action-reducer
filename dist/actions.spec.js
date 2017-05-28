"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("./actions");
const { createAsyncAction, createSimpleAction } = actions_1.default;
// actions.createSimpleAction
describe('Create Simple Action', () => {
    let simpleNone;
    let simpleString;
    let simpleNumber;
    let simpleObject;
    beforeEach(() => {
        simpleNone = createSimpleAction('TOGGLE');
        simpleString = createSimpleAction('CREATE');
        simpleNumber = createSimpleAction('NUMBER');
        simpleObject = createSimpleAction('OBJECT'); 
    });
    it('should create simple action', () => {
        expect(simpleNone()).toEqual({ type: 'TOGGLE' });
        expect(simpleString('A')).toEqual({ type: 'CREATE', request: 'A' });
        expect(simpleNumber(10)).toEqual({ type: 'NUMBER', request: 10 });
        expect(simpleObject({ 'test': 'test' })).toEqual({ type: 'OBJECT', request: { 'test': 'test' } });
    });
});
describe('Create Async Action: SUCCESS', () => {
    let api = jest.fn(() => Promise.resolve());
    let dispatch = jest.fn();
    let asyncString = createAsyncAction('CREATE', api);
    beforeEach(() => {
        asyncString()(dispatch);
    });
    it('should create async action', () => {
        expect(api).toHaveBeenCalled();
        expect(dispatch.mock.calls.length).toEqual(2);
        expect(dispatch.mock.calls[0]).toEqual([{ 'request': undefined, 'status': 'STARTED', 'type': 'CREATE' }]);
        expect(dispatch.mock.calls[1]).toEqual([{ 'request': undefined, 'status': 'SUCCESS', 'type': 'CREATE' }]);
    });
});
describe('Create Async Action: FAILURE', () => {
    const error = { error: 'Error' };
    let api = jest.fn(() => Promise.reject(error));
    let dispatch = jest.fn();
    let asyncString = createAsyncAction('CREATE', api);
    beforeEach(() => {
        asyncString()(dispatch);
    });
    it('should create async action', () => {
        expect(api).toHaveBeenCalled();
        expect(dispatch.mock.calls.length).toEqual(2);
        expect(dispatch.mock.calls[0]).toEqual([{ 'request': undefined, 'status': 'STARTED', 'type': 'CREATE' }]);
        expect(dispatch.mock.calls[1]).toEqual([{ 'request': undefined, 'status': 'FAILURE', 'type': 'CREATE', 'error': error }]);
    });
});
//# sourceMappingURL=actions.spec.js.map