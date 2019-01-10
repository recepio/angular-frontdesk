import {loginReducer} from './reducers/auth.login.reducers';
import {State} from './stateInterface';
import {signUpReducer} from './reducers/auth.signup.reducers';
import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';
import {workspaceReducer} from './reducers/workspace.reducers';


export interface AppState {
    authState: State;
}

export const reducers = {
    authLogin: loginReducer,
    authSignUp: signUpReducer,
    workspace: workspaceReducer
};

export const selectAuthState = createFeatureSelector<AppState>('authLogin');