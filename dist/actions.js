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
// Factory to generate Async actions
// Expects ApiActionGroup<T,R,S> and ApiFunc<Q,S>
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
        if (request) {
            return { type, request };
        }
        else {
            return { type };
        }
    };
}
exports.createSimpleAction = createSimpleAction;
exports.default = {
    createAsyncAction,
    createSimpleAction
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvdmlzd2FuYWovV29yay9SbkQvcmVkdXgtYXN5bmMtYWN0aW9uLXJlZHVjZXIvbGliLyIsInNvdXJjZXMiOlsiYWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVhLFFBQUEsT0FBTyxHQUFHLFNBQVMsQ0FBQTtBQUVuQixRQUFBLE9BQU8sR0FBRyxTQUFTLENBQUE7QUFFbkIsUUFBQSxPQUFPLEdBQUcsU0FBUyxDQUFBO0FBeURoQywrQkFBK0MsSUFBTztJQUNyRCxNQUFNLENBQUM7UUFDTixPQUFPLEVBQUUsQ0FBQyxPQUFVLEtBQ25CLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQU8sRUFBRSxPQUFPLEdBQUcsQ0FBQztRQUN0QyxPQUFPLEVBQUUsQ0FBQyxRQUFXLEVBQUUsT0FBVSxLQUNoQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDO1FBQy9DLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFVLEtBQ3hCLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7S0FDNUMsQ0FBQTtBQUNGLENBQUM7QUFURCxzREFTQztBQUVELG9DQUFvQztBQUNwQyxpREFBaUQ7QUFDakQsK0JBQ0UsRUFBMkIsRUFBRSxFQUFpQjtJQUMvQyxNQUFNLENBQUMsQ0FBQyxPQUFXLEtBQ2xCLENBQUMsUUFBMkI7UUFDM0IsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUM3QixNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQzthQUNoQixJQUFJLENBQUMsQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDM0QsS0FBSyxDQUFDLENBQUMsQ0FBUSxLQUFLLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdEQsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQVRELHNEQVNDO0FBRUQsMkJBQTJDLENBQUksRUFBRSxFQUFpQjtJQUNqRSxNQUFNLENBQUMscUJBQXFCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDM0QsQ0FBQztBQUZELDhDQUVDO0FBRUQsNEJBQXlDLElBQU87SUFDL0MsTUFBTSxDQUFDLENBQUMsT0FBVztRQUNsQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFBO1FBQ3pCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNQLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFBO1FBQ2hCLENBQUM7SUFDRixDQUFDLENBQUE7QUFDRixDQUFDO0FBUkQsZ0RBUUM7QUFFRCxrQkFBZTtJQUNkLGlCQUFpQjtJQUNqQixrQkFBa0I7Q0FDbEIsQ0FBQSJ9