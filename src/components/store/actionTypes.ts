import { TProject, TUser, ViewData } from "../types";

export enum DashboardActions {
    FetchDashboardData = 'FETCH_DASHBOARD_DATA',
    FetchDashboardDataSuccess = 'FETCH_DASHBOARD_DATA_SUCCESS',
    FetchDashboardDataFailure = 'FETCH_DASHBOARD_DATA_FAILURE',
    Login = 'USER_LOGIN',
    Logout = 'USER_LOGOUT',
    ChangeDataView = 'CHANGE_DATA_VIEW',
};

export type TFetchDashboardDataAction = {
    type: DashboardActions.FetchDashboardData;
};

export type TFetchDashboardDataSuccessAction = {
    type: DashboardActions.FetchDashboardDataSuccess;
    payload: {
        projects: Record<string, TProject>;
    };
};

export type TFetchDashboardDataFailureAction = {
    type: DashboardActions.FetchDashboardDataFailure;
};

export type TLoginAction = {
    type: DashboardActions.Login;
    payload: { user: TUser };
};

export type TLogoutAction = {
    type: DashboardActions.Logout;
};

export type TChangeDataViewAction = {
    type: DashboardActions.ChangeDataView;
    payload: { view: ViewData };
};

export type TDashboardActions = 
    | TFetchDashboardDataAction 
    | TFetchDashboardDataSuccessAction 
    | TFetchDashboardDataFailureAction
    | TLoginAction
    | TLogoutAction
    | TChangeDataViewAction; 

