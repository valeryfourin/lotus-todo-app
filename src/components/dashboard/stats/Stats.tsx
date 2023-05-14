import { ChartCard } from "./ChartCard";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	PointElement,
	LineElement,
	Filler,
	ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BarChartCard } from "./BarChartCard";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { authUser, firestore } from "../../../firebase";
import { useSelector } from "react-redux";
import { selectedProjectSelector } from "../../store";
import { groupBy } from "lodash";
import { LoadingIcon } from "../../styledComponents";
import { getNumberOfCompletedTasks, getNumberOfOverdueTasks, getNumberOfUncompletedTasks, getTotalNumberOfTasks } from "./utils";
import { AreaChartCard } from "./AreaChartCard";
import { DoughnutChartCard } from "./DoughnutChartCard";

import "./Stats.css";
import { StackedBarChartCard } from "./StackedBarChartCard";

ChartJS.register(
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend,
	ChartDataLabels
);

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
						<ChartCard title="Completed tasks" value={getNumberOfCompletedTasks(tasks)} iconName="completed" iconColor="success" />
						<ChartCard title="Uncompleted tasks" value={getNumberOfUncompletedTasks(tasks)} iconName="uncompleted" iconColor="secondary"/>
						<ChartCard title="Overdue tasks" value={getNumberOfOverdueTasks(tasks)} iconName="overdue" iconColor="warning"/>
						<ChartCard title="Total tasks" value={getTotalNumberOfTasks(tasks)} iconName="total" iconColor="primary"/>
					</div>
					<div className="charts-row">
						<BarChartCard tasks={tasks} columns={columnsById}/>
						<DoughnutChartCard tasks={tasks}/>
					</div>
					<div className="charts-row">
						<AreaChartCard tasks={tasks}/>
						<StackedBarChartCard tasks={tasks} columns={columnsById}/>
					</div>
				</div>
			) : (<div>No tasks created yet.</div>);
};
