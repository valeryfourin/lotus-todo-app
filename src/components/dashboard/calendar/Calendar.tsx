import { Scheduler } from "@aldabil/react-scheduler";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { authUser, firestore } from "../../../firebase";
import { selectedProjectSelector } from "../../store";
import { LoadingIcon } from "../../styledComponents";
import { TCalendarEvent } from "../../types";
import {EVENTS, getEventsToBeScheduled} from "../utils/calendarUtils";

export const Calendar = () => {
	const selectedProject = useSelector(selectedProjectSelector);

	const [tasks, areTasksLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/tasks`), orderBy('createdAt')));

	const [board, isBoardLoading] = useDocumentData(
		doc(firestore, `users/${authUser.currentUser?.uid}/boards`, selectedProject.id ?? ' ')
	);

	// TODO when no tasks received display message to check include in schedule in task details
	// const scheduledTasks = useMemo(() => {
	// 	if (tasks?.length) {
	// 		return getEventsToBeScheduled(tasks);
	// 	}
	// }, [tasks]);

	let scheduledTasks: Array<TCalendarEvent> = [];
	useEffect(() => {
		if (board?.schedule) {
			scheduledTasks = board.schedule;
		} else if (!isBoardLoading) {
			if (!areTasksLoading && tasks?.length) {
				scheduledTasks = getEventsToBeScheduled(tasks);
				console.log(scheduledTasks)
			}
		}
		// scheduledTasks = awa
	}, [board, areTasksLoading, isBoardLoading, tasks]);

	return areTasksLoading
		? (<LoadingIcon />)
		: (<Scheduler events={scheduledTasks} />);
}
