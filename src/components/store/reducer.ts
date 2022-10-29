import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebase";
import { TDashboardState } from "../types";
import { DashboardActions, TDashboardActions } from "./actionTypes";

const initialState: TDashboardState = {
    user: null,
    projects: {},
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
            const auth = getAuth(app);
            signOut(auth).then(() => {
            console.log('signed out successfully');
            
            }).catch((error: Error) => {
                console.error('error while signing out');
            });
            return {
                ...state,
                user: null,
            };
        }
                

        default: 
            return state;
    }
}