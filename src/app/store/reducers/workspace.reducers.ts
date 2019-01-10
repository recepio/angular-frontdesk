import {initialState, State} from '../stateInterface';
import {AuthActionTypes} from '../actions/ActionTypes';
import {WORKSPACE} from '../actions/workspace.actions';


export function workspaceReducer(state = initialState, action: WORKSPACE): State {
    switch (action.type) {
        default: {
            return state;
        }
    }
}

