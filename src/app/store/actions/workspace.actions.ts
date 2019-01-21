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

export class AddClient implements Action {
    readonly type = AuthActionTypes.ADD_CLIENT;
    constructor(public payload: any){}
}

export class AddPrice implements Action {
    readonly type = AuthActionTypes.ADD_PRICE;
    constructor(public payload: any){}
}

export class AddDescription implements Action {
    readonly type = AuthActionTypes.ADD_DESCRIPTION;
    constructor(public payload: any){}
}

export class AddResource implements Action {
    readonly type = AuthActionTypes.ADD_RESOURCE;
    constructor(public payload: any){}
}

export class AddArea implements Action {
    readonly type = AuthActionTypes.ADD_AREA;
    constructor(public payload: any){}
}

export type WORKSPACE = | CreateWorkspace | CreateSuccess | LoadWorkSpace
    | AddArea | AddUser | AddClient | AddPrice | AddDescription | AddResource;