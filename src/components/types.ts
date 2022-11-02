export type TDashboardState = {
    user: TUser,
    projects: Record<string, TProject>;
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

export type TProject = {
    id: string,
    name: string;
    columns: Array<TColumn>;
    color: string;
};

export type TColumn = {
    id: string,
    header: string;
    tasks: Array<TTask>;
};

export type TTask = {
    id: string,
    title: string;
    description: string;
    createdDate: Date;
    startDate: Date;
    dueDate: Date;
    completeDate: Date;
    status: string;
    priority: Priority;
    completed: boolean;
};

export enum Priority {
    minor = 'Minor',
    major = 'Major',
    critical = 'Critical',
    none = '',
};

export const PriorityColor = {
    [Priority.minor]: 'green',
    [Priority.major]: 'orange',
    [Priority.critical]: 'red',
}

export interface IColumnProps {
    id: number;
    title: string;
    todos: any;
    deleteTodo: any;
    addTodo: any;
};