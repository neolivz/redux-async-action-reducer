"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STARTED = 'STARTED';
exports.SUCCESS = 'SUCCESS';
exports.FAILURE = 'FAILURE';
function apiActionGroupCreator(type) {
    return {
        request: (request) => ({ type, status: exports.STARTED, request, }),
        success: (response, request) => ({ type, status: exports.SUCCESS, request, response }),
        error: (error, request) => ({ type, status: exports.FAILURE, request, error }),
    };
}
exports.apiActionGroupCreator = apiActionGroupCreator;
//Factory to generate Async actions
//Expects ApiActionGroup<T,R,S> and ApiFunc<R,S>
function apiActionGroupFactory(ag, go) {
    return (request) => (dispatch) => {
        dispatch(ag.request(request));
        return go(request)
            .then((response) => dispatch(ag.success(response, request)))
            .catch((e) => dispatch(ag.error(e, request)));
    };
}
exports.apiActionGroupFactory = apiActionGroupFactory;
function createAsyncAction(t, go) {
    return apiActionGroupFactory(apiActionGroupCreator(t), go);
}
exports.createAsyncAction = createAsyncAction;
function createSimpleAction(type) {
    return (request) => {
        return { type, request };
    };
}
exports.createSimpleAction = createSimpleAction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvbmVvbGl2ei9Xb3JrL1JuZC9yZWR1eC10aHVuay1hY3Rpb24tcmVkdWNlci9saWIvIiwic291cmNlcyI6WyJhY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRWEsUUFBQSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBRXBCLFFBQUEsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUVwQixRQUFBLE9BQU8sR0FBRyxTQUFTLENBQUM7QUF5RGpDLCtCQUErQyxJQUFPO0lBQ2xELE1BQU0sQ0FBQztRQUNILE9BQU8sRUFBRSxDQUFDLE9BQVUsS0FDaEIsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBTyxFQUFFLE9BQU8sR0FBRyxDQUFDO1FBQ3pDLE9BQU8sRUFBRSxDQUFDLFFBQVcsRUFBRSxPQUFVLEtBQzdCLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUM7UUFDbEQsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLE9BQVUsS0FDckIsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztLQUNsRCxDQUFBO0FBQ0wsQ0FBQztBQVRELHNEQVNDO0FBRUQsbUNBQW1DO0FBQ25DLGdEQUFnRDtBQUNoRCwrQkFDSyxFQUEyQixFQUFFLEVBQWlCO0lBQy9DLE1BQU0sQ0FBQyxDQUFDLE9BQVcsS0FDZixDQUFDLFFBQTJCO1FBQ3hCLFFBQVEsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUM7YUFDYixJQUFJLENBQUMsQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDM0QsS0FBSyxDQUFDLENBQUMsQ0FBUSxLQUFLLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFBO0FBQ1QsQ0FBQztBQVRELHNEQVNDO0FBRUQsMkJBQTJDLENBQUksRUFBRSxFQUFpQjtJQUM5RCxNQUFNLENBQUMscUJBQXFCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDOUQsQ0FBQztBQUZELDhDQUVDO0FBRUQsNEJBQXlDLElBQU87SUFDNUMsTUFBTSxDQUFDLENBQUMsT0FBVTtRQUNkLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQTtJQUM1QixDQUFDLENBQUE7QUFDTCxDQUFDO0FBSkQsZ0RBSUMifQ==