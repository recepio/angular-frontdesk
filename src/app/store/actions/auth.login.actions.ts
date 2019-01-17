import {Action} from '@ngrx/store';
import {AuthActionTypes} from './ActionTypes';
import {AddArea, AddUser, CreateSuccess, LoadWorkSpace} from './workspace.actions';



export class Login implements Action {
    readonly type = AuthActionTypes.LOGIN;
    constructor(public payload: any) {}
}

export class LoginSuccess implements Action {
    readonly type = AuthActionTypes.LOGIN_SUCCESS;
    constructor(public payload: any) {}
}

export class LoginFailure implements Action {
    readonly type = AuthActionTypes.LOGIN_FAILURE;
    constructor(public payload: any) {}
}

export class LogOut implements Action {
    readonly type = AuthActionTypes.LOGOUT;
    constructor(public payload: any) { }
}

export class SetStatus implements Action {
    readonly type = AuthActionTypes.GET_STATUS;
    constructor(public payload: any){}
}



export type AllLogin = | Login | LoginSuccess | LoginFailure | LogOut | SetStatus | CreateSuccess| LoadWorkSpace | AddArea | AddUser;