import {User} from '..//models/user';
import {workSpace} from '../models/workspace';

export interface State {
    isAuthenticated: boolean;
    user: User | null;
    errorMessage: string | null;
    workSpace: workSpace | null,
    workSpaces: workSpace[] | null
}

export const initialState: State = {
    isAuthenticated: false,
    user: null,
    errorMessage: null,
    workSpace: null,
    workSpaces: null
};