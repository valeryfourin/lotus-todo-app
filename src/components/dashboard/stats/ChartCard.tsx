import { Button, Card, CardContent, IconButton, Typography } from "@mui/material";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { ReactNode } from "react";

interface IChartCardProps {
	title: string;
	description?: string;
	className?: string;
	component?: JSX.Element | any;
	iconName?: string;
	iconColor?: any;
};

const getIconFromName = (iconName: string) => {
	switch (iconName) {
		case 'completed':
			return <CheckBoxIcon />;
		case 'incompleted':
			return <CheckBoxOutlineBlankIcon />;
		case 'overdue':
			return <AccessTimeFilledIcon />;
		case 'total':
			return <ContentPasteIcon />;
		default: return null;
	}
}

export const ChartCard = ({ title, description, className, component, iconName = '', iconColor = 'default'}: IChartCardProps): JSX.Element => {
	const icon = getIconFromName(iconName);

    return (
		<Card className={`chart-card ${className}`} variant="outlined">
			<CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} >
				<div className="column-title column-20">
					<Typography variant="h6" component="div">{ title }</Typography>
					<Typography variant="h2" component="div">{ description }</Typography>
				</div>
				<div className="chart-icon">
					<IconButton size="large" color={iconColor}>
						{icon}
					</IconButton>
				</div>
			</CardContent>
		</Card>
	)
};
