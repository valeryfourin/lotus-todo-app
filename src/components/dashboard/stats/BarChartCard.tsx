import { Card, CardContent, Typography } from '@mui/material';
import { ChartData } from 'chart.js';
import { DocumentData } from 'firebase/firestore';
import { groupBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

interface IBarChartCardProps {
	tasks: Array<DocumentData>
	columns: Record<string, DocumentData>
}

const options = {
	indexAxis: 'y' as const,
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
			suggestedMax: 10,
			beginAtZero: true,
			ticks: {
				stepSize: 1,
			}
		}
	}
};

export const BarChartCard = ({tasks, columns}: IBarChartCardProps): JSX.Element => {
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
					label: 'Uncompleted tasks',
					data: tasksByColumnsCount,
					backgroundColor: 'rgba(159, 168, 218, 0.5)',
					borderColor: 'rgb(159, 168, 218)',
					borderWidth: 1,
				},
			],
		};
		setChartData(data);

		const maxTasksCount = Math.max(...tasksByColumnsCount);
		setChartOptions({...options, scales: {...options.scales, x: {...options.scales.x, suggestedMax: maxTasksCount + 1}}});
	}, [tasks, columns]);

	return (
		<Card className="chart-card chart-card--large" variant="outlined">
			<CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
				<Typography variant="h6" component="div" sx={{marginBottom: '15px'}}>Uncompleted tasks by statuses</Typography>
				<Bar options={chartOptions as any} data={chartData} />
			</CardContent>
		</Card>
	);
};
