export type TDashboardState = {
    user: TUser,
    projects: Record<string, TProject>;
    isDataLoading: boolean;
};

export type TUser = Record<string, string | null> | null;

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
    startDate: Date;
    dueDate: Date;
    status: string;
    completed: boolean;
};

export interface IColumnProps {
    id: number;
    title: string;
    todos: any;
    deleteTodo: any;
    addTodo: any;
};