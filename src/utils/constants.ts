export const HOME_ROUTE = '/';
export const PROJECT_ROUTE = '/project';
export const LISTVIEW_ROUTE = '/list';
export const CALENDARVIEW_ROUTE = '/calendar';
export const STATSVIEW_ROUTE = '/stats';

export const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
export const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: false };
export const dateTimeOptions: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false, };

export const marginSpacing = { margin: '0px 0px 12px 20px' };
export const smallMarginSpacing = { margin: '0px 0px 12px 10px' };

export const truncatedDescriptionStyles = {
	display: '-webkit-box',
    WebkitLineClamp: '4',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
	maxWidth: 400,
};

export const titleMissingMessage = 'Title cannot be empty.';
export const fieldsMissingMessage = 'Please fill in all the fields.';
export const columnMissingMessage = 'Select column for this task.';
export const incorrectDateMessage = 'Task cannot end before starting.';
export const incorrectDeadlineMessage = 'Task cannot have deadline defore end or start date.';
