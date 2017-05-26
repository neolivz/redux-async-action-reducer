import actions from '../actions'
import { SimpleActionCreatorResponse, AsyncActionCreatorReponse, ApiFunc } from '../actions'

const { createAsyncAction, createSimpleAction } = actions

// actions.createSimpleAction
describe('Create Simple Action', () => {
	let simpleNone: SimpleActionCreatorResponse<string, undefined>
	let simpleString: SimpleActionCreatorResponse<string, string>
	let simpleNumber: SimpleActionCreatorResponse<string, number>
	let simpleObject: SimpleActionCreatorResponse<string, object>
	beforeEach(() => {
		simpleNone = createSimpleAction<string, undefined>('TOGGLE')
		simpleString = createSimpleAction<string, string>('CREATE')
		simpleNumber = createSimpleAction<string, number>('NUMBER')
		simpleObject = createSimpleAction<string, object>('OBJECT')
	})

	it('should create simple action', () => {
		expect(simpleNone()).toEqual({ type: 'TOGGLE' })
		expect(simpleString('A')).toEqual({ type: 'CREATE', request: 'A' })
		expect(simpleNumber(10)).toEqual({ type: 'NUMBER', request: 10 })
		expect(simpleObject({ 'test': 'test' })).toEqual({ type: 'OBJECT', request: { 'test': 'test' } })
	})
})

describe('Create Async Action: SUCCESS', () => {

	let api: ApiFunc<any, any> = jest.fn(() => Promise.resolve())
	let dispatch = jest.fn()

	let asyncString: AsyncActionCreatorReponse<string, string, string> = createAsyncAction<string, string, string>('CREATE', api)

	beforeEach(() => {
		asyncString()(dispatch)
	})

	it('should create async action', () => {
		expect(api).toHaveBeenCalled()
		expect(dispatch.mock.calls.length).toEqual(2)
		expect(dispatch.mock.calls[0]).toEqual([{ 'request': undefined, 'status': 'STARTED', 'type': 'CREATE' }])
		expect(dispatch.mock.calls[1]).toEqual([{ 'request': undefined, 'status': 'SUCCESS', 'type': 'CREATE' }])
	})
})
describe('Create Async Action: FAILURE', () => {
	const error = { error: 'Error' }
	let api: ApiFunc<any, any> = jest.fn(() => Promise.reject(error))
	let dispatch = jest.fn()

	let asyncString: AsyncActionCreatorReponse<string, string, string> =
		createAsyncAction<string, string, string>('CREATE', api)

	beforeEach(() => {
		asyncString()(dispatch)
	})

	it('should create async action', () => {
		expect(api).toHaveBeenCalled()
		expect(dispatch.mock.calls.length).toEqual(2)
		expect(dispatch.mock.calls[0]).toEqual([{ 'request': undefined, 'status': 'STARTED', 'type': 'CREATE' }])
		expect(dispatch.mock.calls[1]).toEqual([{ 'request': undefined, 'status': 'FAILURE', 'type': 'CREATE', 'error': error }])
	})
})
