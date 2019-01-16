import {Action} from '@ngrx/store';
import {AuthActionTypes} from './ActionTypes';


export class CreateWorkspace implements Action {
    readonly type = AuthActionTypes.CREATE_WORKSPACE;
    constructor(public payload: any) {}
}

export class CreateSuccess implements Action {
    readonly type = AuthActionTypes.CREATE_WORKSPACE_SUCCESS;
    constructor(public payload: any) {}
}

export class LoadUsers implements Action {
    readonly type = AuthActionTypes.LOAD_WORKSPACE_USERS;
    constructor(public payload: any){}
}

export type WORKSPACE = | CreateWorkspace | CreateSuccess | LoadUsers;