import { getAuth, signOut } from "firebase/auth";
import { app, authUser } from "../../firebase";
import { TDashboardState, ViewData } from "../types";
import { DashboardActions, TDashboardActions } from "./actionTypes";

const initialState: TDashboardState = {
    user: null,
    projects: {},
    view: ViewData.grid,
    isDataLoading: true,
};

export const dashboardReducer = (
    state = initialState,
    action: TDashboardActions
): TDashboardState => {
    switch (action.type) {
        case DashboardActions.FetchDashboardData:
            return {
                ...state,
                isDataLoading: true
            };

        case DashboardActions.FetchDashboardDataSuccess:
            return {
                ...state,
                projects: action.payload.projects,
                isDataLoading: false
            };

        case DashboardActions.FetchDashboardDataFailure:
            return {
                ...state,
                isDataLoading: false
            };

        case DashboardActions.Login:
            return {
                ...state,
                user: action.payload.user,
            };

        case DashboardActions.Logout: {
            if (state.user) {
                signOut(authUser)
                .then(() => {
                    console.log('signed out successfully');
                }).catch((error: Error) => {
                    console.error('Error while signing out ', error);
                });
            }
            
            return {
                ...state,
                user: null,
            };
        }
        
        case DashboardActions.ChangeDataView:
            return {
                ...state,
                view: action.payload.view,
            };

        default: 
            return state;
    }
}