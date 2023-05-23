import { Card, CardContent, Typography } from '@mui/material';
import { ChartData } from 'chart.js';
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getNumberOfTasksCompletedOverTimeWithDates } from '../utils/statsUtils';

interface IAreaChartCardProps {
	tasks: Array<DocumentData>
}

const options = {
	responsive: true,
	plugins: {
		legend: {
			display: false
		},
		datalabels: {
			display: false
		}
	},
	scales: {
		x: {
			display: true,
			ticks: {
				maxTicksLimit: 10
			}
		},
		y: {
			display: true,
			suggestedMax: 10,
			beginAtZero: true,
			ticks: {
				stepSize: 1,
			}
		}
	}
};

export const AreaChartCard = ({tasks}: IAreaChartCardProps): JSX.Element => {
	const [chartData, setChartData] = useState<any>({
		labels: [],
		datasets: []
	});

	const [chartOptions, setChartOptions] = useState<any>(options);

	useEffect(() => {
		const { numberOfTasksCompletedOverTime, datesOfTasksCompletion } = getNumberOfTasksCompletedOverTimeWithDates(tasks);

		const data: ChartData = {
			labels: datesOfTasksCompletion,
			datasets: [
				{
					fill: true,
					label: 'Completed tasks',
					data: numberOfTasksCompletedOverTime,
					borderColor: 'rgb(248, 187, 208)',
					backgroundColor: 'rgba(248, 187, 208, 0.5)',
				},
			],
		};
		setChartData(data);

		const maxTasksCount = Math.max(...numberOfTasksCompletedOverTime);
		setChartOptions({...options, scales: {...options.scales, y: {...options.scales.y, suggestedMax: maxTasksCount + 1}}});
	}, [tasks]);

	return (
		<Card className="chart-card chart-card--large" variant="outlined">
			<CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
				<Typography variant="h6" component="div" sx={{marginBottom: '15px'}}>Task completion over time</Typography>
				<Line options={chartOptions as any} data={chartData} />
			</CardContent>
		</Card>
	);
};
