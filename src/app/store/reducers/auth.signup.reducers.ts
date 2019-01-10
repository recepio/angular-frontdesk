import {initialState, State} from '../stateInterface';
import {AllLogin} from '../actions/auth.login.actions';
import {AuthActionTypes} from '../actions/ActionTypes';


export function signUpReducer(state = initialState, action: AllLogin): State {
    switch (action.type) {
        default: {
            return state;
        }
    }
}

