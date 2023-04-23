import { Card, CardContent, Typography } from "@mui/material";

export const ListHeader = (): JSX.Element => {
    return (
		<div className="list-header">
			<span className="column-title column-task">Task</span>
			<span className="column-title column-due">Due</span>
			<span className="column-title column-priority">Priority</span>
			<span className="column-title column-status">Status</span>
		</div>
	);
};
