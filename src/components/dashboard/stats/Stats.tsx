import { ChartCard } from "./ChartCard";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import "./Stats.css";

export const Stats = (): JSX.Element => {
    return (
	<div className="charts-wrap">
		<div className="charts-row">
			<ChartCard title="Completed tasks" description="13" className="chart-card--small" iconName="completed" iconColor="success" />
			<ChartCard title="Incompleted tasks" description="3" className="chart-card--small" iconName="incompleted" iconColor="secondary"/>
			<ChartCard title="Overdue tasks" description="6" className="chart-card--small" iconName="overdue" iconColor="warning"/>
			<ChartCard title="Total tasks" description="22" className="chart-card--small" iconName="total" iconColor="primary"/>
		</div>
		<div className="charts-row">
			<ChartCard title="Incompleted tasks by status"  className="chart-card--large" component={{}}/>
			<ChartCard title="All tasks by completion status"  className="chart-card--large" component={{}}/>
		</div>
		<div className="charts-row">
			<ChartCard title="Upcoming tasks by status"className="chart-card--medium" component={{}}/>
			<ChartCard title="Tasks completion over time"className="chart-card--medium" component={{}}/>
		</div>
	</div>
)};
