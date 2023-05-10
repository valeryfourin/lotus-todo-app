import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import { Button } from "@mui/material";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { authUser, firestore } from "../../../firebase";
import { saveSchedule } from "../../../services/firestore/boardService";
import { selectedProjectSelector } from "../../store";
import { LoadingIcon } from "../../styledComponents";
import { getTasksSchedule, getEventsToBeScheduled, convertEventsToBeScheduled } from "../utils/calendarUtils";
import { TCalendarEvent } from "../../types";
import TimeRangeSetter from "./TimeRangeSetter";

export const Calendar = () => {
	const selectedProject = useSelector(selectedProjectSelector);

	const { setEvents, events, ...schedule } = useScheduler();
	console.log(schedule)
	const [scheduledTasks, setScheduledTasks] = useState<any>([]);
	const [workingHours, setWorkingHours] = useState<any>(() => [
		new Date(2022, 3, 17, 8, 30),
		new Date(2022, 3, 17, 8, 30),
	]);

	const [tasks, areTasksLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/tasks`), orderBy('createdAt')));

	const [board, isBoardLoading] = useDocumentData(
		doc(firestore, `users/${authUser.currentUser?.uid}/boards`, selectedProject.id ?? ' ')
	);

	// const scheduledTasks = useMemo(() => {
	// 	if (tasks?.length) {
	// 		return getEventsToBeScheduled(tasks);
	// 	}
	// }, [tasks]);

	useEffect(() => {
		if (board?.schedule && tasks?.length) {
			setScheduledTasks(convertEventsToBeScheduled(board.schedule));
		} else if (!isBoardLoading) {
			if (!areTasksLoading && tasks?.length) {
				setScheduledTasks(getEventsToBeScheduled(tasks));
			}
		}
	}, [board, tasks, isBoardLoading, areTasksLoading]);

	const handleGenerateSchedule = (): void => {
		if (tasks?.length) {
			console.log(getTasksSchedule(tasks));
			setEvents(getTasksSchedule(tasks));
			setScheduledTasks(getTasksSchedule(tasks));
		}
	};

	const handleSaveSchedule = (): void => {
		console.log(events);
		saveSchedule(selectedProject.id, events as TCalendarEvent[]);
		alert('Schedule saved');
	};

	const retrieveSchedule = (): void => {
		if (board?.schedule) {
			setScheduledTasks(convertEventsToBeScheduled(board.schedule));
			alert('Previous saved schedule retrieved');
		} else {
			alert('No previously saved schedule found');
		}
	};

	return areTasksLoading
		? (<LoadingIcon />)
		: scheduledTasks?.length ? (<>
			<Button className="create-button" variant="contained" onClick={handleGenerateSchedule} sx={{margin: '0px 0px 12px 20px'}}>
				Generate new schedule
			</Button>
			<Button className="create-button" variant="outlined" onClick={handleSaveSchedule} sx={{margin: '0px 0px 12px 20px'}}>
				Save schedule
			</Button>
			<Button className="create-button" variant="outlined" onClick={retrieveSchedule} sx={{margin: '0px 0px 12px 20px'}}>
				Retrieve latest schedule
			</Button>
			<TimeRangeSetter
				label="Choose working hours: "
				value={[new Date(), new Date()]}
				setValue={(newValue: any) => setWorkingHours(newValue)}
			/>

			<Scheduler events={scheduledTasks}/>
		</>) : (<div>No tasks to schedule. Make sure you checked 'Include in schedule' field in tasks you want to schedule.</div>)
}
