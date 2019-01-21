import {initialState, State} from '../stateInterface';
import {AllLogin} from '../actions/auth.login.actions';
import {AuthActionTypes} from '../actions/ActionTypes';


export function loginReducer(state = initialState, action: AllLogin): State {
    switch (action.type) {
        case AuthActionTypes.LOGIN_SUCCESS: {
            return {
                ...state,
                isAuthenticated: true,
                user: {
                    token: action.payload.token,
                    email: action.payload.email
                },
                errorMessage: null
            };
        };
        case AuthActionTypes.LOGIN_FAILURE: {
            return {
                ...state,
                errorMessage: ''
            };
        };
        case AuthActionTypes.GET_STATUS: {
            return {
                ...state,
                isAuthenticated: true,
                user: {
                    token: action.payload.token,
                    email: action.payload.user.email
                },
                workSpaces: action.payload.users
            };
        };
        case AuthActionTypes.CREATE_WORKSPACE_SUCCESS: {
            state.workSpaces.push(action.payload.workspace);
            return {
                ...state,
                workSpace: action.payload.workspace
            };
        };
        case AuthActionTypes.LOAD_WORKSPACE: {
            return {
                ...state,
                workSpace: action.payload.users,
                areas:  action.payload.areas,
                clients: action.payload.clients
            };
        };
        case  AuthActionTypes.ADD_USER: {
            return {
                ...state,
                workSpace: action.payload
            };
        };
        case  AuthActionTypes.ADD_AREA: {
            action.payload.area['resources'] = [];
            state.areas.push(action.payload.area);
            return {
                ...state
            };
        };
        case  AuthActionTypes.ADD_RESOURCE: {
            action.payload.resource['prices'] = [];
            action.payload.resource['descriptions'] = [];
            state.areas.map((area) => {
                    if (area.id === action.payload.resource.areaId){
                        return  area.resources.push(action.payload.resource);
                    }return area;
                });
            return {
                ...state
            };
        };
        case  AuthActionTypes.ADD_PRICE: {
            state.areas.map((area) => {
               return area.resources.map((resource) => {
                   if (resource.id === action.payload.price.resourceId){
                       return  resource.prices.push(action.payload.price);
                   }return resource;
               });
            });
            return {
                ...state
            };
        };
        case  AuthActionTypes.ADD_DESCRIPTION: {
            state.areas.map((area) => {
                return area.resources.map((resource) => {
                    if (resource.id === action.payload.description.resourceId){
                        return  resource.descriptions.push(action.payload.description);
                    }return resource;
                });
            });
            return {
                ...state
            };
        };
        case  AuthActionTypes.ADD_CLIENT: {
            state.clients.push(action.payload.client);
            return {
                ...state
            };
        };
        case AuthActionTypes.LOGOUT: {
            return initialState;
        };
        default: {
            return state;
        }
    }
}

