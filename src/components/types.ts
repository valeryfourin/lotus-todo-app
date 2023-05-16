import { DocumentData } from "firebase/firestore";
import React, { MouseEventHandler, ReactNode } from "react";

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
	tasks: Array<TTask>;
	schedule: Array<TCalendarEvent>;
	workingHours: Array<Date>;
};

export type TColumn = {
    id: string;
    name: string;
};

export type TTask = {
    id: string;
    name: string;
    createdAt?: Date;
    description?: string;
    startDate?: Date | null | undefined;
    endDate?: Date | null | undefined;
    deadline?: Date | null | undefined;
    completeDate?: Date | null | undefined;
    columnId?: string;
    priority: Priority;
	estimate?: number;
    completed?: boolean;
	isRepeated?: boolean;
	repeatsEvery?: RepetitionsFrequency;
	isDaySpecific: boolean;
	isScheduled?: boolean;
};

export interface ITaskProps {
	id: string;
	name: string;
	columnId?: string;
	columnName?: string;
	description: string;
	startDate: Date | null;
	endDate: Date | null;
	deadline: Date | null;
	priority: string;
	isDaySpecific: boolean;
	isScheduled: boolean;
	completed: boolean;
	completeDate?: Date;
	isGridView?: boolean;
};

export interface IDetailsDialogProps {
	task: ITaskProps;
	taskNameFormatted?: ReactNode;
	setEditingMode: Function;
	toggleTaskDone: MouseEventHandler<SVGSVGElement>;
	toggleScheduled: Function;
	handleCancelClose: MouseEventHandler<HTMLButtonElement>;
};

export interface IEditDialogProps {
	task: ITaskProps;
	handleExitEditingMode: MouseEventHandler<HTMLButtonElement>;
	handleConfirmClose: MouseEventHandler<HTMLButtonElement>;
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
};

export interface IColumnProps {
    id: string;
    title: string;
	tasks: Array<DocumentData>;
};

export interface ITabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
};

export interface IPopupIcon {
    actionType: ActionType;
    entity: Entity;
    boardId?: string;
    columnId?: string;
    styles?: React.CSSProperties;
};

export type ActionType = 'add' | 'edit' | 'delete';
export type Entity = 'board' | 'column';

export type TCalendarEvent = {
	event_id: string;
	title: string;
	start: Date;
	end: Date;
	editable?: boolean;
	color: string;
};
