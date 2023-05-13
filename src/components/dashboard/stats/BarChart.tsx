import { Typography } from '@mui/material';
import { ChartData } from 'chart.js';
import { Bar } from 'react-chartjs-2';

interface IBarChartProps { // TODO: What is this type?
	data: ChartData<"bar", any, any>
}

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'bottom' as const,
		},
	}
};

export const BarChart = ({data}: IBarChartProps): JSX.Element => {
	return (
		<div className="chart-card--large">
			<Typography variant="h6" component="div">Incompleted tasks by sections</Typography>
			<Bar options={options} data={data} />
		</div>
	);
};
