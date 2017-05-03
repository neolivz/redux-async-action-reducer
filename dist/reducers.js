"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("./actions");
exports.initialState = {
    // isArray: false,
    failure: false,
    working: false,
    store: undefined
};
exports.initialActiveState = Object.assign({}, exports.initialState, { open: false });
function reducerActionGroupFactory() {
    return (state, action) => {
        if (action.status === actions_1.STARTED) {
            return Object.assign({}, state, { failure: false, working: true });
        }
        else if (action.status === actions_1.SUCCESS) {
            return Object.assign({}, state, { failure: false, working: false, store: action.response });
        }
        else if (action.status === actions_1.FAILURE) {
            return Object.assign({}, state, { failure: true, working: false });
        }
        return state;
    };
}
exports.reducerActionGroupFactory = reducerActionGroupFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlcnMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL25lb2xpdnovV29yay9SbmQvcmVkdXgtdGh1bmstYWN0aW9uLXJlZHVjZXIvbGliLyIsInNvdXJjZXMiOlsicmVkdWNlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBbUU7QUE2QnRELFFBQUEsWUFBWSxHQUFvQjtJQUN6QyxrQkFBa0I7SUFDbEIsT0FBTyxFQUFFLEtBQUs7SUFDZCxPQUFPLEVBQUUsS0FBSztJQUNkLEtBQUssRUFBRSxTQUFTO0NBQ25CLENBQUM7QUFFVyxRQUFBLGtCQUFrQixxQkFBK0Isb0JBQVksSUFBRSxJQUFJLEVBQUUsS0FBSyxJQUFHO0FBYTFGO0lBQ0ksTUFBTSxDQUFDLENBQUMsS0FBb0IsRUFBRSxNQUFnQztRQUMxRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLGlCQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sbUJBQU0sS0FBSyxJQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksSUFBRztRQUN2RCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssaUJBQU8sQ0FBQyxDQUFDLENBQUM7WUFDbkMsTUFBTSxtQkFBTSxLQUFLLElBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsUUFBUSxJQUFHO1FBQ2hGLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxpQkFBTyxDQUFDLENBQUMsQ0FBQztZQUNuQyxNQUFNLG1CQUFNLEtBQUssSUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLElBQUc7UUFDdkQsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQyxDQUFBO0FBQ0wsQ0FBQztBQVhELDhEQVdDIn0=