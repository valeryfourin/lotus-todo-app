import { Card, CardContent, IconButton, Typography } from "@mui/material";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

interface IChartCardProps {
	title: string;
	value?: number;
	iconName?: string;
	iconColor?: any;
};

const getIconFromName = (iconName: string) => {
	switch (iconName) {
		case 'completed':
			return <CheckBoxIcon />;
		case 'uncompleted':
			return <CheckBoxOutlineBlankIcon />;
		case 'overdue':
			return <AccessTimeFilledIcon />;
		case 'total':
			return <ContentPasteIcon />;
		default: return null;
	}
}

export const ChartCard = ({ title, value, iconName = '', iconColor = 'default'}: IChartCardProps): JSX.Element => {
	const icon = getIconFromName(iconName);

    return (
		<Card className="chart-card chart-card--small" variant="outlined">
			<CardContent sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }} >
				<div className="column-title column-20">
					<Typography variant="h6" component="div">{ title }</Typography>
					<Typography variant="h2" component="div">{ value }</Typography>
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
