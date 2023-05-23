import { Card, CardContent, Typography } from '@mui/material';
import { ChartData } from 'chart.js';
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getNumberOfCompletedTasks, getNumberOfUncompletedTasks } from '../utils/statsUtils';

interface IDoughnutChartCardProps {
	tasks: Array<DocumentData>
}

const options = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'right' as const,
		},
		datalabels: {
            formatter: (value: any, ctx: any) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.forEach((data: any) => sum += data);
                let percentage = Math.round((value * 100 / sum))+"%";
                return percentage;
            },
        }
	},

};

export const DoughnutChartCard = ({tasks}: IDoughnutChartCardProps): JSX.Element => {
	const [chartData, setChartData] = useState<any>({
		labels: [],
		datasets: []
	});

	useEffect(() => {
		const data: ChartData = {
			labels: ['Completed', 'Uncompleted'],
			datasets: [
				{
					fill: true,
					data: [getNumberOfCompletedTasks(tasks), getNumberOfUncompletedTasks(tasks)],
					borderColor: [
						'rgb(178, 223, 219)',
						'rgb(255, 204, 188)',
					],
					backgroundColor: [
						'rgba(178, 223, 219, 0.5)',
						'rgba(255, 204, 188, 0.5)'
					],
				},
			],
		};
		setChartData(data);
	}, [tasks]);

	return (
		<Card className="chart-card chart-card--large" variant="outlined">
			<CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
				<Typography variant="h6" component="div" sx={{marginBottom: '15px'}}>All tasks by completion status</Typography>
				<div>
					<Doughnut
						options={options}
						data={chartData}
						width={400}
						height={230}
					/>
				</div>
			</CardContent>
		</Card>
	);
};
