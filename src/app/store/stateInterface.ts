import {User} from '..//models/user';
import {workSpace} from '../models/workspace';
import {Item} from '../item';

export interface State {
    isAuthenticated: boolean;
    user: User | null;
    errorMessage: string | null;
    workSpace: workSpace | null,
    workSpaces: workSpace[] | null,
    users: User[] | null,
    areas: Item[] | null,
}

export const initialState: State = {
    isAuthenticated: false,
    user: null,
    errorMessage: null,
    workSpace: null,
    workSpaces: null,
    users: [],
    areas: [],
};