import { Card, CardContent, Typography } from '@mui/material';
import { ChartData } from 'chart.js';
import { DocumentData } from 'firebase/firestore';
import { groupBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Priority } from '../../types';
import { getNumberOfTasksInEachColumnByPriority } from '../utils/statsUtils';

interface IBarChartCardProps {
	tasks: Array<DocumentData>
	columns: Record<string, DocumentData>
}

const options = {
	responsive: true,
	plugins: {
		legend: {
			display: true
		},
		datalabels: {
			display: false
		}
	},
	scales: {
		x: {
			stacked: true,
		},
		y: {
			display: true,
			stacked: true,
			suggestedMax: 10,
			beginAtZero: true,
			ticks: {
				stepSize: 1,
			}
		}
	}
};

export const StackedBarChartCard = ({tasks, columns}: IBarChartCardProps): JSX.Element => {
	const [chartData, setChartData] = useState<any>({
		labels: [],
		datasets: []
	});

	const [chartOptions, setChartOptions] = useState<any>(options);

	useEffect(() => {
		const tasksByColumns = groupBy(tasks, 'columnId');

		const tasksByColumnsCount = Object.keys(tasksByColumns)?.map((columnId: string) => tasksByColumns[columnId].length);
		const columnsNames = Object.keys(columns).map((columnId: string) => columns[columnId][0]?.name);

		const data: ChartData = {
			labels: columnsNames,
			datasets: [
				{
					label: 'Minor',
					data: getNumberOfTasksInEachColumnByPriority(tasks, columns, Priority.minor),
					backgroundColor: 'rgba(174, 213, 129, 0.5)',
					borderColor: 'rgb(174, 213, 129)',
					borderWidth: 2,
				},
				{
					label: 'Major',
					data: getNumberOfTasksInEachColumnByPriority(tasks, columns, Priority.major),
					backgroundColor: 'rgba(255, 183, 77, 0.5)',
					borderColor: 'rgb(255, 183, 77)',
					borderWidth: 2,
				},
				{
					label: 'Critical',
					data: getNumberOfTasksInEachColumnByPriority(tasks, columns, Priority.critical),
					backgroundColor: 'rgba(206, 147, 216, 0.5)',
					borderColor: 'rgb(206, 147, 216)',
					borderWidth: 2,
				},
				{
					label: 'Not set',
					data: getNumberOfTasksInEachColumnByPriority(tasks, columns, Priority.notSet),
					backgroundColor: 'rgba(189, 189, 189, 0.5)',
					borderColor: 'rgb(189, 189, 189)',
					borderWidth: 2,
				},
			],
		};
		setChartData(data);

		const maxTasksCount = Math.max(...tasksByColumnsCount);
		setChartOptions({...options, scales: {...options.scales, y: {...options.scales.y, suggestedMax: maxTasksCount + 1}}});
	}, [tasks, columns]);

	return (
		<Card className="chart-card chart-card--large" variant="outlined">
			<CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
				<Typography variant="h6" component="div" sx={{marginBottom: '15px'}}>Tasks by priority in each column</Typography>
				<Bar options={chartOptions as any} data={chartData} />
			</CardContent>
		</Card>
	);
};
