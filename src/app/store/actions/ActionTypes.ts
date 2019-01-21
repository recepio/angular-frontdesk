export enum AuthActionTypes{
    LOGIN = '[Auth] Login',
    LOGIN_SUCCESS =  '[Auth] Login Success',
    LOGIN_FAILURE = '[Auth] Login Failure',
    SIGNUP = '[Auth] Signup',
    SIGNUP_SUCCESS = '[Auth] SignUp Success',
    SIGNUP_FAILURE = '[Auth] SignUp Failure',
    LOGOUT = '[Auth] LogOut',
    GET_STATUS = '[Auth] Auth Status',
    CREATE_WORKSPACE = '[Workspace] Create',
    CREATE_WORKSPACE_SUCCESS = '[Workspace] Create Success',
    LOAD_WORKSPACE = '[Workspace] Load workspace]',
    ADD_USER = '[Workspace] add new user ',
    ADD_AREA = '[Workspace] add new area',
    ADD_RESOURCE = '[Workspace] add new resource',
    ADD_CLIENT = '[Workspace] add new client',
    ADD_DESCRIPTION = '[Workspace] add new description',
    ADD_PRICE = '[Workspace] add new price'
}