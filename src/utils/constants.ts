export const HOME_ROUTE = '/';
export const PROJECT_ROUTE = '/project';
export const LISTVIEW_ROUTE = '/list';
export const CALENDARVIEW_ROUTE = '/calendar';
export const STATSVIEW_ROUTE = '/stats';

export const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
export const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric' };
export const dateTimeOptions: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };

export const marginSpacing = { margin: '0px 0px 12px 20px' };
export const smallMarginSpacing = { margin: '0px 0px 12px 10px' };

export const truncatedDescriptionStyles = {
	display: '-webkit-box',
    '-webkit-line-clamp': '4',
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
	maxWidth: 400,
};
