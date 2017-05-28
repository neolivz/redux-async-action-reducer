// import {
// 	AsyncAction,
// 	STARTED, SUCCESS, FAILURE
// } from '../actions'
import { initialState } from './async-reducer'
import {
	syncReducerGenerator,
	syncReducer,
	arraySyncCreateReducerGenerator,
	arraySyncLoadReducerGenerator,
	arraySyncDeleteReducerGenerator,
	arraySyncUpdateReducerGenerator,
} from './sync-reducer'
describe('Sync Reducer Generator ', () => {
	const reducer = syncReducerGenerator()
	it('should create', () => {
		expect(reducer(initialState, { type: 'DOES_NOT_MATTER' })).toEqual(initialState)
	})
})
describe('Sync Reducer Generator with different type', () => {
	const reducer = syncReducerGenerator('TYPE')
	it('should create', () => {
		expect(reducer(initialState, { type: 'DIFF_TYPE' })).toEqual(initialState)
	})
})
describe('Sync Reducer Generator with type', () => {
	const reducer = syncReducerGenerator('TYPE')
	it('should create', () => {
		expect(reducer(initialState, { type: 'TYPE' })).toEqual(initialState)
	})
})
describe('Sync Reducer Generator', () => {
	const reducer = syncReducer()
	it('should create', () => {
		expect(reducer(initialState, { type: 'DOES_NOT_MATTER', request: 'Test' })).toEqual({ ...initialState, store: 'Test' })
	})
})
describe('Sync Create Array Reducer Generator', () => {
	const reducer = arraySyncCreateReducerGenerator()
	it('should create', () => {
		expect(reducer(initialState, { type: 'DOES_NOT_MATTER', request: 'Test' })).toEqual({ ...initialState, store: ['Test'] })
	})
	it('should add', () => {
		expect(reducer({ ...initialState, store: ['Test1'] },
			{ type: 'DOES_NOT_MATTER', request: 'Test2' })).toEqual({ ...initialState, store: ['Test1', 'Test2'] })
	})
	it('should do nothing', () => {
		expect(reducer({ ...initialState, store: ['Test1'] },
			{ type: 'DOES_NOT_MATTER' })).toEqual({ ...initialState, store: ['Test1'] })
	})
})
describe('Sync Create Array Reducer Generator with type', () => {
	const reducer = arraySyncCreateReducerGenerator('TEST')
	it('should create', () => {
		expect(reducer(initialState, { type: 'TEST', request: 'Test' })).toEqual({ ...initialState, store: ['Test'] })
	})
	it('should not add', () => {
		expect(reducer({ ...initialState, store: ['Test1'] },
			{ type: 'WRONG_TYPE', request: 'Test2' })).toEqual({ ...initialState, store: ['Test1'] })
	})
	it('should add', () => {
		expect(reducer({ ...initialState, store: ['Test1'] },
			{ type: 'TEST', request: 'Test2' })).toEqual({ ...initialState, store: ['Test1', 'Test2'] })
	})
	it('should not add', () => {
		expect(reducer({ ...initialState, store: ['Test1'] },
			{ type: 'TEST' })).toEqual({ ...initialState, store: ['Test1'] })
	})
})
describe('Sync Load Array Reducer Generator with type', () => {
	const reducer = arraySyncLoadReducerGenerator('TEST')
	it('should create', () => {
		expect(reducer(initialState, { type: 'TEST', request: ['Test'] })).toEqual({ ...initialState, store: ['Test'] })
	})
	it('should replace', () => {
		expect(reducer({ ...initialState, store: ['Test1'] },
			{ type: 'TEST', request: ['Test2'] })).toEqual({ ...initialState, store: ['Test2'] })
	})
	it('should do nothing for wrong_type', () => {
		expect(reducer({ ...initialState, store: ['Test1'] },
			{ type: 'WRONG_TYPE', request: 'Test2' })).toEqual({ ...initialState, store: ['Test1'] })
	})
	it('should remove the store', () => {
		expect(reducer({ ...initialState, store: ['Test1'] },
			{ type: 'TEST' })).toEqual({ ...initialState, store: undefined })
	})
})
describe('Sync Delete Array Reducer Generator with type', () => {
	const reducer = arraySyncDeleteReducerGenerator('TEST')
	it('should do nothing', () => {
		expect(reducer(initialState, { type: 'TEST', request: 'Test' })).toEqual({ ...initialState })
	})
	it('should delete', () => {
		expect(reducer({ ...initialState, store: ['Test1'] },
			{ type: 'TEST', request: 'Test1' })).toEqual({ ...initialState, store: [] })
	})
	it('should delete', () => {
		expect(reducer({ ...initialState, store: ['Test1','Test2'] },
			{ type: 'TEST', request: 'Test1' })).toEqual({ ...initialState, store: ['Test2'] })
	})
	it('should delete', () => {
		expect(reducer({ ...initialState, store: ['Test2','Test1'] },
			{ type: 'TEST', request: 'Test1' })).toEqual({ ...initialState, store: ['Test2'] })
	})
	it('should delete', () => {
		expect(reducer({ ...initialState, store: ['Test2','Test1'] },
			{ type: 'TEST', request: 'Test1' })).toEqual({ ...initialState, store: ['Test2'] })
	})
	it('should delete only first when repeat', () => {
		expect(reducer({ ...initialState, store: ['Test1','Test1'] },
			{ type: 'TEST', request: 'Test1' })).toEqual({ ...initialState, store: ['Test1'] })
	})
	it('should delete', () => {
		expect(reducer({ ...initialState, store: ['Test2','Test1', 'Test3'] },
			{ type: 'TEST', request: 'Test1' })).toEqual({ ...initialState, store: ['Test2','Test3'] })
	})
	it('should delete', () => {
		expect(reducer({ ...initialState, store: ['Test1'] },
			{ type: 'TEST', request: 'Test1' })).toEqual({ ...initialState, store: [] })
	})
	it('should not delete when store is not array', () => {
		expect(reducer({ ...initialState, store: 'Test1' },
			{ type: 'TEST', request: 'Test1' })).toEqual({ ...initialState, store: 'Test1' })
	})
	it('should not delete when delete request has wrong entry', () => {
		expect(reducer({ ...initialState, store: ['Test1'] },
			{ type: 'TEST', request: 'Test2' })).toEqual({ ...initialState, store: ['Test1'] })
	})
	it('should do nothing for wrong_type', () => {
		expect(reducer({ ...initialState, store: ['Test1'] },
			{ type: 'WRONG_TYPE', request: 'Test1' })).toEqual({ ...initialState, store: ['Test1'] })
	})
	it('should do nothing if the request is missing', () => {
		expect(reducer({ ...initialState, store: ['Test1'] },
			{ type: 'TEST' })).toEqual({ ...initialState, store: ['Test1'] })
	})
})
describe('Sync Delete Array Reducer Generator with type', () => {
	const reducer = arraySyncUpdateReducerGenerator('TEST')
	it('should do nothing', () => {
		expect(reducer(initialState, { type: 'TEST', request: 'Test' })).toEqual( initialState )
	})
	it('should update', () => {
		expect(reducer({ ...initialState, store: ['Test1','Test3'] },
			{ type: 'TEST', request: ['Test3','Test2'] })).toEqual({ ...initialState, store: ['Test1', 'Test2'] })
	})
	it('should update', () => {
		expect(reducer({ ...initialState, store: ['Test1','Test3'] },
			{ type: 'TEST', request: ['Test4','Test2'] })).toEqual({ ...initialState, store: ['Test1', 'Test3'] })
	})

})
describe('Sync Delete Array Reducer Generator without', () => {
	const reducer = arraySyncUpdateReducerGenerator()
	it('should do nothing', () => {
		expect(reducer(initialState, { type: 'TEST', request: 'Test' })).toEqual( initialState )
	})
	it('should update', () => {
		expect(reducer({ ...initialState, store: ['Test1','Test3'] },
			{ type: 'TEST', request: ['Test3','Test2'] })).toEqual({ ...initialState, store: ['Test1', 'Test2'] })
	})
	it('should update', () => {
		expect(reducer({ ...initialState, store: ['Test1','Test3'] },
			{ type: 'TEST', request: ['Test4','Test2'] })).toEqual({ ...initialState, store: ['Test1', 'Test3'] })
	})

})
