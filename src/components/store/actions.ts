import { TProject, TUser } from "../types";
import { DashboardActions, TDashboardActions } from "./actionTypes";

export const fetchDashboardData = (): TDashboardActions => ({type: DashboardActions.FetchDashboardData});

export const fetchDashboardDataSuccess = (
    projects: Record<string, TProject>
): TDashboardActions => ({
    type: DashboardActions.FetchDashboardDataSuccess,
    payload: { projects }
});

export const fetchDashboardDataFailure = (): TDashboardActions => ({type: DashboardActions.FetchDashboardDataFailure});

export const login = (user: TUser): TDashboardActions => ({type: DashboardActions.Login, payload: { user }});

export const logout = (): TDashboardActions => ({type: DashboardActions.Logout});