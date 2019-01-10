import {Action} from '@ngrx/store';
import {AuthActionTypes} from './ActionTypes';

export class SignUp implements Action{
    readonly type = AuthActionTypes.SIGNUP;
    constructor(public payload: any){}
}

export class SignUpSuccess implements Action {
    readonly type = AuthActionTypes.SIGNUP_SUCCESS;
    constructor(public payload: any){}
}

export class SignUpFailure implements Action {
    readonly type = AuthActionTypes.SIGNUP_FAILURE;
}

export type AllSignup = | SignUp | SignUpSuccess | SignUpFailure;