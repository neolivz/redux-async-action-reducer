import { shouldReducerExecute, createReducer } from './reducer-common'
import { SyncReducer } from './sync-reducer'
import { AsyncReducer, initialState } from './async-reducer'

describe('Should Reducer Execute', () => {
	it('Should be true if called with undefined type', () => {
		expect(shouldReducerExecute(undefined, { type: 'ANY' })).toBe(true)
	})
	it('Should be true if called with same type', () => {
		expect(shouldReducerExecute('ANY', { type: 'ANY' })).toBe(true)
	})
	it('Should be false if called with different type', () => {
		expect(shouldReducerExecute('NOT_ANY', { type: 'ANY' })).toBe(false)
	})
	it('Should be true if type array contains same type', () => {
		expect(shouldReducerExecute(['ANY', 'NOT_ANY'], { type: 'ANY' })).toBe(true)
	})
	it('Should be false if type array does not contain same type', () => {
		expect(shouldReducerExecute(['SOME_TYPE', 'NOT_ANY'], { type: 'ANY' })).toBe(false)
	})
})
describe('Empty Create reducer', () => {
	const emptyReducer = createReducer()
	it('Should return state as is with any action', () => {
		const myStore = { store: 'myStore' }
		expect(emptyReducer(myStore, { type: 'ANY' })).toEqual(myStore)
	})
})

describe('Create only with sync reducer', () => {
	const s1 = jest.fn((state, action) => state)
	const s2 = jest.fn((state, action) => state)
	const syncReducers: SyncReducer<any, any, any>[] = [s1, s1, s2]
	const syncCreateReducer = createReducer(syncReducers)
	it('Should return state as is with any action and invoke sync reducers', () => {
		expect(syncCreateReducer(initialState, { type: 'ANY' })).toEqual(initialState)
		expect(s1.mock.calls.length).toBe(2) // as we have 2 times in sync reducer
		expect(s2.mock.calls.length).toBe(1)
		expect(s1.mock.calls[0]).toEqual([initialState, { type: 'ANY' }])
		expect(s1.mock.calls[1]).toEqual([initialState, { type: 'ANY' }])
		expect(s2.mock.calls[0]).toEqual([initialState, { type: 'ANY' }])
	})
})

describe('Create only with async reducer', () => {
	const s1 = jest.fn((state, action) => state)
	const s2 = jest.fn((state, action) => state)
	const asyncReducers: AsyncReducer<any, any, any, any>[] = [s1, s2, s1]
	const syncCreateReducer = createReducer(undefined, asyncReducers)
	it('Should return state as is with any action and invoke async reducers', () => {
		expect(syncCreateReducer(initialState, { type: 'ANY' })).toEqual(initialState)
		expect(s1.mock.calls.length).toBe(2) // as we have 2 times in sync reducer
		expect(s2.mock.calls.length).toBe(1)
		expect(s1.mock.calls[0]).toEqual([initialState, { type: 'ANY' }])
		expect(s1.mock.calls[1]).toEqual([initialState, { type: 'ANY' }])
		expect(s2.mock.calls[0]).toEqual([initialState, { type: 'ANY' }])
	})
})

describe('Create  with both sync and async reducer', () => {
	const s1 = jest.fn((state, action) => state)
	const s2 = jest.fn((state, action) => state)
	const syncReducers: SyncReducer<any, any, any>[] = [s1, s1]
	const asyncReducers: AsyncReducer<any, any, any, any>[] = [s2]
	const syncCreateReducer = createReducer(syncReducers, asyncReducers)
	it('Should return state as is with any action', () => {
		expect(syncCreateReducer(initialState, { type: 'ANY' })).toEqual(initialState)
		expect(s1.mock.calls.length).toBe(2) // as we have 2 times in sync reducer
		expect(s2.mock.calls.length).toBe(1)
		expect(s1.mock.calls[0]).toEqual([initialState, { type: 'ANY' }])
		expect(s1.mock.calls[1]).toEqual([initialState, { type: 'ANY' }])
		expect(s2.mock.calls[0]).toEqual([initialState, { type: 'ANY' }])
	})
})

describe('Create  with both sync and async reducer with state change', () => {
	const s1 = jest.fn((state, action) => ({ ...state, store: 0 }))
	const s2 = jest.fn((state, action) => ({ ...state, store: 1 }))
	const as1 = jest.fn((state, action) => ({ ...state, store: 2 }))
	const as2 = jest.fn((state, action) => ({ ...state, store: 3 }))
	const syncReducers: SyncReducer<any, any, any>[] = [s1, s2]
	const asyncReducers: AsyncReducer<any, any, any, any>[] = [as1, as2]
	const syncCreateReducer = createReducer(syncReducers, asyncReducers)
	it('Should return state as is with any action', () => {
		expect(syncCreateReducer(initialState, { type: 'ANY' })).toEqual({ ...initialState, store: 3 })
		expect(s1.mock.calls.length).toBe(1) // as we have 2 times in sync reducer
		expect(s2.mock.calls.length).toBe(1)
		expect(as1.mock.calls.length).toBe(1)
		expect(as2.mock.calls.length).toBe(1)
		expect(s1.mock.calls[0]).toEqual([{ ...initialState }, { type: 'ANY' }])
		expect(s2.mock.calls[0]).toEqual([{ ...initialState, store: 0 }, { type: 'ANY' }])
		expect(as1.mock.calls[0]).toEqual([{ ...initialState, store: 1 }, { type: 'ANY' }])
		expect(as2.mock.calls[0]).toEqual([{ ...initialState, store: 2 }, { type: 'ANY' }])
	})
})
describe('Create  with both sync and async reducer with non async state', () => {
	const s1 = jest.fn((state, action) => ({ ...state, store: 0 }))
	const s2 = jest.fn((state, action) => ({ ...state, store: 1 }))
	const as1 = jest.fn((state, action) => ({ ...state, store: 2 }))
	const as2 = jest.fn((state, action) => ({ ...state, store: 3 }))
	const syncReducers: SyncReducer<any, any, any>[] = [s1, s2]
	const asyncReducers: AsyncReducer<any, any, any, any>[] = [as1, as2]
	const syncCreateReducer = createReducer(syncReducers, asyncReducers)
	it('Should return state as is with any action', () => {
		expect(syncCreateReducer({ store: 0 }, { type: 'ANY' })).toEqual({ store: 1 })
		expect(s1.mock.calls.length).toBe(1) // as we have 2 times in sync reducer
		expect(s2.mock.calls.length).toBe(1)
		expect(as1.mock.calls.length).toBe(0)
		expect(as2.mock.calls.length).toBe(0)
	})
})
