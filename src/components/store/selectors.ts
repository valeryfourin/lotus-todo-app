import { TDashboardState, TProject, TUser, ViewData } from "../types";

export const dashboardSelector = (state: TDashboardState): TDashboardState => state;

export const dashboardDataSelector = (state: TDashboardState): Record<string, TProject> => state.projects;

export const isDataLoadingSelector = (state: TDashboardState): boolean => state.isDataLoading;

export const userSelector = (state: TDashboardState): TUser => state.user;

export const dataViewSelector = (state: TDashboardState): ViewData => state.view;

export const selectedProjectSelector = (state: TDashboardState): Record<string, string> => state.selectedProject;