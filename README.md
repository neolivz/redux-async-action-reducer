# redux-thunk-action-reducer

## Introduction
Simple redux action creation and reducer wrapper that makes creating and handling asynchronous and synchronous wrapper easier. It's completely written with type safety in mind, with typescript.

## Actions/ Action Creator
Action creator can either create either synchronous or asynchronous. For more general information about actions refer to [redux docs](http://redux.js.org/docs/basics/Actions.html)

### Asynchronous Action
Asynchronous Action are designed to work with libraries like redux-thunk or redux-saga.

Traditional way of creating asynchronous action
```typescript
import { api } from '../api'
import { ACTION_TYPE, STARTED, SUCCEEDED, FAILURE } from '../constants'

const action = (dispatch) => {
	(request) => {
		dispatch({ type: ACTION_TYPE, status: STARTED, request })
		api().then((response) => {
			dispatch({ type: ACTION_TYPE, status: SUCCEEDED, request, response})
		}).catch((error)=>{
			dispatch({ type: ACTION_TYPE, status: FAILURE, request, error})
		})
	}
}
```
can be replaced with single line (or two lines)
```typescript
import { createAsyncAction } from 'redux-async-action-reducer'
import { api } from '../api'
import { ACTION_TYPE } from '../constants'


const action = createAsyncAction(ACTION_TYPE, api)
//with typescript
const action = createAsyncAction<ACTION_TYPE, ApiResponseObj>(ACTION_TYPE, api)
```

### Synchronous Action
A synchronous action instantly returns an Action object (an object with type attribute and a string type value)

Traditional way of creating synchronous action
```typescript
import { ACTION_TYPE } from '../constants'
const action = (request) => ({
	type: ACTION_TYPE, request // payload is most common used key.
})
```

can be replaced with single line
```typescript
import { createSimpleAction } from 'redux-async-action-reducer'
import { ACTION_TYPE } from '../constants'

const action = createSimpleAction(ACTION_TYPE);
//with typescript
const action = createSimpleAction<ACTION_TYPE, RequestType>(ACTION_TYPE);

```
** Use  of request and response is convenient and consistent across synchronous and asynchronous actions **

## Reducers
Reducer can also be either synchronous or asynchronous. Asynchronous reducer need an asynchronous action while synchronous reducer can act up on both asynchronous and synchronous actions. For more general information about reducers refer to [redux docs](http://redux.js.org/docs/basics/Reducers.html)

Traditional way of creating a reducer is using switch cases
```typescript
const reducer  = (state = initialState, action){
	switch(action.type){
		//All synchronous and asynchronous reducers goes here
	}
}
```
would be replaced with something like this
```typescript
import { createReducer } from 'redux-async-action-reducer';
const reducer = createReducer(initialState,
  [/*list of synchronous reducer*/], [/*list of asynchronous reducers*/]
)
```


*NOTE: As a side effect a synchronous reducer acting upon asynchronous action will be called 3 times. Future version will support synchronous action status reducer*


### Asynchronous Reducer
Traditional way of creating asynchronous reducer
```typescript
import { ACTION_TYPE, STARTED, SUCCEEDED, FAILURE } from '../constants'

const actionTypeReducer = (state, action){
	if(action.status === STARTED){
		{...state, working: true, failure: false, completed: false, started: new Date(), finished: undefined}
	} else if(action.status === SUCCEEDED){
		{...state, working: false, failure: false, completed: true, store: action.response}
	} else if( action.status === FAILURE){
		{...state, working: false, failure: true, completed: false, finished: new Date()}
	}
	return state
}
const reducer  = (state = initialState, action) => {
	switch(action.type){
		case 'ACTION_TYPE': actionTypeReducer(state, action)
		//
		// more switch cases for reducers
		//
	}
}
```
can be replaced with
```typescript
import { createReducer, asyncReducer } from 'redux-async-action-reducer';

import { ACTION_TYPE } from '../constants'
const reducer = createReducer(initialState, [/*synchronous reducers*/],
  [asyncReducer(ACTION_TYPE), /*more reducers*/]
)

```




### Synchronous Reducer
Synchronous reducer does act upon 
Traditional way of creating synchronous reducer
```typescript
import { ACTION_TYPE } from '../constants'

const actionTypeReducer = (state, action){
	return {...state, request: action.request}
}
const reducer  = (state = initialState, action) => {
	switch(action.type){
		case 'ACTION_TYPE': actionTypeReducer(state, action)
		//
		// more switch cases for reducers
		//
	}
}
```
can be replaced with 
```typescript
import { createReducer, syncReducer } from 'redux-async-action-reducer';
import { ACTION_TYPE } from '../constants'

const reducer = createReducer(initialState,
  [syncReducer(ACTION_TYPE), /*more reducers*/],[/*asynchronous reducers if needed*/]
)
```


## Array Reducers
When a store is an array object we can use array reducer. It supports CLUD (Load instead of Read) apis. Both synchronous and asynchronous support full CLUD operations on array reducers.

## Create 
Adding an element into the array 

### Synchronous 
```typescript
import { arraySyncCreateReducer } from 'redux-async-action-reducer'

const reducer = createReducer(initialState,
  [arraySyncCreateReducer<ACTION_TYPE, RequestType>(ACTION_TYPE), /*more reducers*/],[/*asynchronous reducers if needed*/]
)
// This will add request object into array
```
### Asynchronous 
```typescript
import { arrayAsyncCreateReducer } from 'redux-async-action-reducer'

const reducer = createReducer(initialState,
  [arrayAsyncCreateReducer<ACTION_TYPE, RequestType, ResponseType>(ACTION_TYPE), /*more reducers*/],[/*asynchronous reducers if needed*/]
)
// This will add response object into array
```
*NOTE: If your create API does not give response object which need to be added, change the response object to what ever you want to add*

## Read/Load
Load all elements into the array
### Synchronous 
```typescript
import { arraySyncLoadReducer } from 'redux-async-action-reducer'

const reducer = createReducer(initialState,
  [arraySyncLoadReducer<ACTION_TYPE, RequestType>(ACTION_TYPE), /*more reducers*/],[/*asynchronous reducers if needed*/]
)
// This will load RequestType[] into store
```
### Asynchronous 
```typescript
import { arrayAsyncLoadReducer } from 'redux-async-action-reducer'

const reducer = createReducer(initialState,
  [arrayAsyncLoadReducer<ACTION_TYPE, RequestType, ResponseType>(ACTION_TYPE), /*more reducers*/],[/*asynchronous reducers if needed*/]
)
// This will load ResponseType[] into store
```

## Update
Load all elements into the array
### Synchronous 
```typescript
import { arraySyncUpdateReducer } from 'redux-async-action-reducer'

const reducer = createReducer(initialState,
  [arraySyncUpdateReducer<ACTION_TYPE, RequestType>(ACTION_TYPE), /*more reducers*/],[/*asynchronous reducers if needed*/]
)
// This will need a request array with 2 elements with first element original object and second object what the values to be updated to 
//eg. the action would look something like this
import { createSimpleAction } from 'redux-async-action-reducer'
const action = createSimpleAction<ACTION_TYPE, RequestType>(ACTION_TYPE);
const updateArray: RequestType[] = [originalObject, updatedObject]
action(updateArray) //store.dispatch(action(updateArray))

```
### Asynchronous 
```typescript
import { arrayAsyncUpdateReducer } from 'redux-async-action-reducer'

const reducer = createReducer(initialState,
  [arrayAsyncLoadReducer<ACTION_TYPE, RequestType>(ACTION_TYPE), /*more reducers*/],[/*asynchronous reducers if needed*/]
)
// This expect action to dispatch request with an array [originalObject, updatedObject] while response will give you the updatedObject. 
import { createAsyncAction } from 'redux-async-action-reducer'
import { api } from '../api'
const action = createAsyncAction<ACTION_TYPE, RequestType>(ACTION_TYPE, api);
const updateArray: RequestType[] = [originalObject, updatedObject]
action(updateArray) //store.dispatch(action(updateArray))
```


## Delete
Load all elements into the array
### Synchronous 
```typescript
import { arraySyncDeleteReducer } from 'redux-async-action-reducer'

const reducer = createReducer(initialState,
  [arraySyncDeleteReducer<ACTION_TYPE, RequestType>(ACTION_TYPE), /*more reducers*/],[/*asynchronous reducers if needed*/]
)
// This will load RequestType[] into store
```
### Asynchronous 
```typescript
import { arrayAsyncDeleteReducer } from 'redux-async-action-reducer'

const reducer = createReducer(initialState,
  [arrayAsyncDeleteReducer<ACTION_TYPE, RequestType>(ACTION_TYPE), /*more reducers*/],[/*asynchronous reducers if needed*/]
)
// Action need to be invoked with request object of the element which needs to be removed from the array
```