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
import "./Stats.css";
import { BarChart } from "./BarChart";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { authUser, firestore } from "../../../firebase";
import { useSelector } from "react-redux";
import { selectedProjectSelector } from "../../store";
import { groupBy } from "lodash";
import { LoadingIcon } from "../../styledComponents";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
	labels,
	datasets: [
		{
		label: 'Dataset 1',
		data: [10, 50, 34, 65, 56, 23, 12],
		backgroundColor: 'rgba(255, 99, 132, 0.5)',
		}
	],
};

export const Stats = (): JSX.Element => {
	const selectedProject = useSelector(selectedProjectSelector);

	const [columns, columnsLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/columns`), orderBy('createdAt')));

	const [tasks, tasksLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/tasks`), orderBy('createdAt')));

	const isDataLoading = columnsLoading && tasksLoading;
	const isDataLoaded = columns && columns?.length && tasks && tasks?.length;

	const columnsById = groupBy(columns, 'id');

    return isDataLoading
		? (<LoadingIcon />)
		: isDataLoaded
			? (
				<div className="charts-wrap custom-scroll">
					<div className="charts-row">
						<ChartCard title="Completed tasks" description="13" className="chart-card--small" iconName="completed" iconColor="success" />
						<ChartCard title="Incompleted tasks" description="3" className="chart-card--small" iconName="incompleted" iconColor="secondary"/>
						<ChartCard title="Overdue tasks" description="6" className="chart-card--small" iconName="overdue" iconColor="warning"/>
						<ChartCard title="Total tasks" description="22" className="chart-card--small" iconName="total" iconColor="primary"/>
					</div>
					<div className="charts-row">
						<BarChart data={data}/>
					</div>
					<div className="charts-row">
						<ChartCard title="Upcoming tasks by status"className="chart-card--medium" component={{}}/>
						<ChartCard title="Tasks completion over time"className="chart-card--medium" component={{}}/>
					</div>
				</div>
			) : (<div>No tasks created yet.</div>);
};
