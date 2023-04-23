import { Scheduler } from "@aldabil/react-scheduler";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { authUser, firestore } from "../../../firebase";
import { selectedProjectSelector } from "../../store";
import {EVENTS} from "../utils/calendarUtils";

export const Calendar = () => {
	const selectedProject = useSelector(selectedProjectSelector);

	const [columns, areColumnsLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/columns`), orderBy('createdAt')));

	const areColumnsLoaded = columns && columns?.length;
		console.log(columns)

	const [tasks, areTasksLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/columns/${columns && columns[1].id}/tasks`), orderBy('createdAt')));
console.log(tasks)

  return <Scheduler events={EVENTS} />;
}
