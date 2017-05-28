"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {
// 	AsyncAction,
// 	STARTED, SUCCESS, FAILURE
// } from '../actions'
const async_reducer_1 = require("./async-reducer");
const sync_reducer_1 = require("./sync-reducer");
describe('Sync Reducer Generator ', () => {
    const reducer = sync_reducer_1.syncReducerGenerator();
    it('should create', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'DOES_NOT_MATTER' })).toEqual(async_reducer_1.initialState);
    });
});
describe('Sync Reducer Generator with different type', () => {
    const reducer = sync_reducer_1.syncReducerGenerator('TYPE');
    it('should create', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'DIFF_TYPE' })).toEqual(async_reducer_1.initialState);
    });
});
describe('Sync Reducer Generator with type', () => {
    const reducer = sync_reducer_1.syncReducerGenerator('TYPE');
    it('should create', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'TYPE' })).toEqual(async_reducer_1.initialState);
    });
});
describe('Sync Reducer Generator', () => {
    const reducer = sync_reducer_1.syncReducer();
    it('should create', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'DOES_NOT_MATTER', request: 'Test' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: 'Test' }));
    });
});
describe('Sync Create Array Reducer Generator', () => {
    const reducer = sync_reducer_1.arraySyncCreateReducerGenerator();
    it('should create', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'DOES_NOT_MATTER', request: 'Test' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test'] }));
    });
    it('should add', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }), { type: 'DOES_NOT_MATTER', request: 'Test2' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1', 'Test2'] }));
    });
    it('should do nothing', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }), { type: 'DOES_NOT_MATTER' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }));
    });
});
describe('Sync Create Array Reducer Generator with type', () => {
    const reducer = sync_reducer_1.arraySyncCreateReducerGenerator('TEST');
    it('should create', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'TEST', request: 'Test' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test'] }));
    });
    it('should not add', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }), { type: 'WRONG_TYPE', request: 'Test2' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }));
    });
    it('should add', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }), { type: 'TEST', request: 'Test2' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1', 'Test2'] }));
    });
    it('should not add', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }), { type: 'TEST' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }));
    });
});
describe('Sync Load Array Reducer Generator with type', () => {
    const reducer = sync_reducer_1.arraySyncLoadReducerGenerator('TEST');
    it('should create', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'TEST', request: ['Test'] })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test'] }));
    });
    it('should replace', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }), { type: 'TEST', request: ['Test2'] })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test2'] }));
    });
    it('should do nothing for wrong_type', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }), { type: 'WRONG_TYPE', request: 'Test2' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }));
    });
    it('should remove the store', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }), { type: 'TEST' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: undefined }));
    });
});
describe('Sync Delete Array Reducer Generator with type', () => {
    const reducer = sync_reducer_1.arraySyncDeleteReducerGenerator('TEST');
    it('should do nothing', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'TEST', request: 'Test' })).toEqual(Object.assign({}, async_reducer_1.initialState));
    });
    it('should delete', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }), { type: 'TEST', request: 'Test1' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: [] }));
    });
    it('should delete', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1', 'Test2'] }), { type: 'TEST', request: 'Test1' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test2'] }));
    });
    it('should delete', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test2', 'Test1'] }), { type: 'TEST', request: 'Test1' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test2'] }));
    });
    it('should delete', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test2', 'Test1'] }), { type: 'TEST', request: 'Test1' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test2'] }));
    });
    it('should delete only first when repeat', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1', 'Test1'] }), { type: 'TEST', request: 'Test1' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }));
    });
    it('should delete', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test2', 'Test1', 'Test3'] }), { type: 'TEST', request: 'Test1' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test2', 'Test3'] }));
    });
    it('should delete', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }), { type: 'TEST', request: 'Test1' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: [] }));
    });
    it('should not delete when store is not array', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: 'Test1' }), { type: 'TEST', request: 'Test1' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: 'Test1' }));
    });
    it('should not delete when delete request has wrong entry', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }), { type: 'TEST', request: 'Test2' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }));
    });
    it('should do nothing for wrong_type', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }), { type: 'WRONG_TYPE', request: 'Test1' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }));
    });
    it('should do nothing if the request is missing', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }), { type: 'TEST' })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1'] }));
    });
});
describe('Sync Delete Array Reducer Generator with type', () => {
    const reducer = sync_reducer_1.arraySyncUpdateReducerGenerator('TEST');
    it('should do nothing', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'TEST', request: 'Test' })).toEqual(async_reducer_1.initialState);
    });
    it('should update', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1', 'Test3'] }), { type: 'TEST', request: ['Test3', 'Test2'] })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1', 'Test2'] }));
    });
    it('should update', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1', 'Test3'] }), { type: 'TEST', request: ['Test4', 'Test2'] })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1', 'Test3'] }));
    });
});
describe('Sync Delete Array Reducer Generator without', () => {
    const reducer = sync_reducer_1.arraySyncUpdateReducerGenerator();
    it('should do nothing', () => {
        expect(reducer(async_reducer_1.initialState, { type: 'TEST', request: 'Test' })).toEqual(async_reducer_1.initialState);
    });
    it('should update', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1', 'Test3'] }), { type: 'TEST', request: ['Test3', 'Test2'] })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1', 'Test2'] }));
    });
    it('should update', () => {
        expect(reducer(Object.assign({}, async_reducer_1.initialState, { store: ['Test1', 'Test3'] }), { type: 'TEST', request: ['Test4', 'Test2'] })).toEqual(Object.assign({}, async_reducer_1.initialState, { store: ['Test1', 'Test3'] }));
    });
});
//# sourceMappingURL=sync-reducer.spec.js.map