import {
	AsyncAction,
	STARTED, SUCCESS, FAILURE
} from '../actions'
import {
	AsyncReducerGeneratorFn,
	AsyncReducer,
	AsyncStore,
	AsyncActiveStore,
	arrayAsyncCreateReducerGenerator,
	arrayAsyncDeleteReducerGenerator,
	arrayAsyncLoadReducerGenerator,
	arrayAsyncUpdateReducerGenerator,
	asyncReducerGenerator,
	createReducer,
	simpleAsyncReducerGenerator,
	syncReducerGenerator,
	initialState,
	initialActiveState
} from '../reducers'

describe('Asyn Reducer Generator : start success fail functions should be invoked and return corresponding values', () => {
	let startFn = jest.fn((state) => state)
	let successFn = jest.fn((state) => state)
	let failureFn = jest.fn((state) => state)
	let reducer: AsyncReducer<any, any, any, any>
	beforeEach(() => {
		startFn = jest.fn((state) => state)
		successFn = jest.fn((state) => state)
		failureFn = jest.fn((state) => state)
		reducer = asyncReducerGenerator('ANY', startFn, successFn, failureFn)
	})

	it('should return the same state', () => {
		expect(
			reducer(initialState, { type: 'ANY', request: undefined, status: STARTED }) === initialState
		).toEqual(true)
		expect(
			reducer(initialActiveState, { type: 'ANY', request: undefined, status: STARTED }) === initialActiveState
		).toEqual(true)
	})

	it('should not invoke any mock when type is diffrent', () => {
		reducer(initialState, { type: 'WRONG_TYPE', request: undefined, status: STARTED })
		expect(startFn.mock.calls.length).toBe(0)
		expect(successFn.mock.calls.length).toBe(0)
		expect(failureFn.mock.calls.length).toBe(0)
	})
	it('should call only start mock when status is STARTED', () => {
		reducer(initialState, { type: 'ANY', request: undefined, status: STARTED })
		expect(startFn.mock.calls.length).toBe(1)
		expect(successFn.mock.calls.length).toBe(0)
		expect(failureFn.mock.calls.length).toBe(0)
	})
	it('should call only success mock when status is SUCCESS', () => {
		reducer(initialState, { type: 'ANY', request: undefined, status: SUCCESS, response: 'Whola' })
		expect(startFn.mock.calls.length).toBe(0)
		expect(successFn.mock.calls.length).toBe(1)
		expect(failureFn.mock.calls.length).toBe(0)
	})
	it('should call only failure mock when status is FAILURE', () => {
		reducer(initialState, { type: 'ANY', request: undefined, status: FAILURE, error: new Error('Error') })
		expect(startFn.mock.calls.length).toBe(0)
		expect(successFn.mock.calls.length).toBe(0)
		expect(failureFn.mock.calls.length).toBe(1)
	})
	it('should return current state if invalid status is passed', () => {
		expect(reducer(initialState, { type: 'ANY' } as AsyncAction<any, any, any>) === initialState).toBe(true)
		expect(startFn.mock.calls.length).toBe(0)
		expect(successFn.mock.calls.length).toBe(0)
		expect(failureFn.mock.calls.length).toBe(0)
	})
})

describe('Asyn Reducer Generator Fn', () => {
	let startFn: AsyncReducerGeneratorFn<any, any, any> =
		(state: AsyncStore<any>, request: any) => ({ ...state, working: true, completed: false, failure: false })
	let successFn: AsyncReducerGeneratorFn<any, any, any> =
		(state: AsyncStore<any>, request: any, response: any) => (
			{ ...state, working: false, completed: true, failure: false, store: response }
		)
	let failureFn: AsyncReducerGeneratorFn<any, any, any> =
		(state: AsyncStore<any>, request: any, response: any, error: Error) => (
			{ ...state, working: false, completed: false, failure: true, error }
		)
	let reducer: AsyncReducer<any, any, any, any>
	beforeEach(() => {
		reducer = asyncReducerGenerator('ANY', startFn, successFn, failureFn)
	})

	it('should get start fn output', () => {
		expect(
			reducer(initialState, { type: 'ANY', request: undefined, status: 'STARTED' })
		).toEqual({ ...initialState, working: true, completed: false, failure: false })
	})
	it('should get success fn output', () => {
		expect(
			reducer(initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response' })
		).toEqual({ ...initialState, working: false, completed: true, failure: false, store: 'Response' })
	})
	it('should get failure fn output', () => {
		expect(
			reducer(initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })
		).toEqual({ ...initialState, working: false, completed: false, failure: true, error: Error('Fail') })
	})
})

describe('Simple Async Reducer Generator Fn', () => {
	let reducer: AsyncReducer<any, any, any, any>
	beforeEach(() => {
		reducer = simpleAsyncReducerGenerator('ANY')
	})

	it('should get start fn output', () => {
		expect(
			reducer(initialState, { type: 'ANY', request: undefined, status: 'STARTED' })
		).toMatchObject({ ...initialState, working: true, completed: false, failure: false })
	})
	it('should get success fn output', () => {
		expect(
			reducer(initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response' })
		).toMatchObject({ ...initialState, working: false, completed: true, failure: false, store: 'Response' })
	})
	it('should get failure fn output', () => {
		expect(
			reducer(initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })
		).toMatchObject({ ...initialState, working: false, completed: false, failure: true, error: Error('Fail') })
	})
})

describe('Simple Async Reducer Generator Fn', () => {
	let reducer: AsyncReducer<any, any, any, any>
	beforeEach(() => {
		reducer = simpleAsyncReducerGenerator('ANY')
	})

	it('should get start fn output', () => {
		expect(
			reducer(initialState, { type: 'ANY', request: undefined, status: 'STARTED' })
		).toMatchObject({ ...initialState, working: true, completed: false, failure: false })
	})
	it('should get success fn output', () => {
		expect(
			reducer(initialState, { type: 'ANY', request: undefined, status: 'SUCCESS', response: 'Response' })
		).toMatchObject({ ...initialState, working: false, completed: true, failure: false, store: 'Response' })
	})
	it('should get failure fn output', () => {
		expect(
			reducer(initialState, { type: 'ANY', request: undefined, status: 'FAILURE', error: Error('Fail') })
		).toMatchObject({ ...initialState, working: false, completed: false, failure: true, error: Error('Fail') })
	})
})
