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

export class LoadWorkSpace implements Action {
    readonly type = AuthActionTypes.LOAD_WORKSPACE;
    constructor(public payload: any){}
}

export class AddUser implements Action {
    readonly type = AuthActionTypes.ADD_USER;
    constructor(public payload: any){}
}

export class AddArea implements Action {
    readonly type = AuthActionTypes.ADD_AREA;
    constructor(public payload: any){}
}

export type WORKSPACE = | CreateWorkspace | CreateSuccess | LoadWorkSpace | AddArea | AddUser;