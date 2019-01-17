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
                areas:  action.payload.areas
            };
        };
        case  AuthActionTypes.ADD_USER: {
            return {
                ...state,
                workSpace: action.payload
            };
        };
        case  AuthActionTypes.ADD_AREA: {
            state.areas.push(action.payload.area);
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

