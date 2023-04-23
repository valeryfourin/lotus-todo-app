import React from "react";

export type TDashboardState = {
    user: TUser;
    projects: Record<string, TProject>;
    selectedProject: Record<string, string>;
    view: ViewData;
    isDataLoading: boolean;
};

export type TUser = Record<string, string | null> | null;

export enum ViewData {
    grid = 'Grid',
    list = 'List',
    calendar = 'Calendar',
    stats = 'Stats',
};

enum RepetitionsFrequency {
	monthly = 'Monthly',
	weekly = 'Weekly',
	daily = 'Daily',
};

export type TProject = {
    id: string;
    name: string;
    columns?: Array<TColumn>;
};

export type TColumn = {
    id: string;
    name: string;
    tasks: Array<TTask>;
};

export type TTask = {
    id?: string;
    name: string;
    createdAt?: Date;
    description?: string;
    startDate?: Date | null;
    endDate?: Date | null;
    deadline?: Date | null;
    completeDate?: Date;
    status?: string;
    priority?: Priority;
	estimate?: number;
    completed?: boolean;
	isRepeated?: boolean;
	repeatsEvery?: RepetitionsFrequency;
	isDaySpecific: boolean
};

export enum Priority {
    minor = 'Minor',
    major = 'Major',
    critical = 'Critical',
    notSet = 'Not set',
};

export const PriorityColor = {
    [Priority.minor]: '#78c480',
    [Priority.major]: '#e56724',
    [Priority.critical]: '#bd70bc',
    [Priority.notSet]: '#a7c3d3',
}

export interface IColumnProps {
    id: string;
    title: string;
};

export interface ITabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

export interface IPopupIcon {
    actionType: ActionType;
    entity: Entity;
    boardId?: string;
    columnId?: string;
    styles?: React.CSSProperties;
}

export type ActionType = 'add' | 'edit' | 'delete';
export type Entity = 'board' | 'column';
