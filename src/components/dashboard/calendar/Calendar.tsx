import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import { Button } from "@mui/material";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { authUser, firestore } from "../../../firebase";
import { saveSchedule, saveWorkingHours } from "../../../services/firestore/boardService";
import { selectedProjectSelector } from "../../store";
import { LoadingIcon } from "../../styledComponents";
import { getTasksSchedule, getEventsToBeScheduled, convertEventsToBeScheduled } from "../utils/calendarUtils";
import { TCalendarEvent } from "../../types";
import TimeRangeSetter from "./TimeRangeSetter";
import { marginSpacing } from "../../../utils/constants";
import { DayHours } from "@aldabil/react-scheduler/types";

export const Calendar = () => {
	const selectedProject = useSelector(selectedProjectSelector);

	const { setEvents, events, ...schedule } = useScheduler();
	console.log(schedule)
	const [scheduledTasks, setScheduledTasks] = useState<any>([]);

	const [workingHoursStart, setWorkingHoursStart] = useState<Date>(new Date('January 1, 1970 8:00:00'));
	const [workingHoursEnd, setWorkingHoursEnd] = useState<Date>(new Date('January 1, 1970 17:00:00'));

	const [tasks, areTasksLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/tasks`), orderBy('createdAt')));

	const [board, isBoardLoading] = useDocumentData(
		doc(firestore, `users/${authUser.currentUser?.uid}/boards`, selectedProject.id ?? ' ')
	);

	useEffect(() => {
		if (board?.schedule && tasks?.length) {
			setScheduledTasks(convertEventsToBeScheduled(board.schedule));
		} else if (!isBoardLoading) {
			if (!areTasksLoading && tasks?.length) {
				setScheduledTasks(getEventsToBeScheduled(tasks));
			}
		}

		if (board?.workingHours?.length) {
			setWorkingHoursStart(board.workingHours[0].toDate());
			setWorkingHoursEnd(board.workingHours[1].toDate());
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

	const handleChangeWorkingHoursStart = (newWorkingHoursStart: Date): void => {
		saveWorkingHours(selectedProject.id, [newWorkingHoursStart, workingHoursEnd]);
		setWorkingHoursStart(newWorkingHoursStart);
	};

	const handleChangeWorkingHoursEnd = (newWorkingHoursEnd: Date): void => {
		saveWorkingHours(selectedProject.id, [workingHoursStart, newWorkingHoursEnd]);
		setWorkingHoursEnd(newWorkingHoursEnd);
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
		: scheduledTasks?.length ? (
			<div className="calendar-wrap custom-scroll">
				<Button className="create-button" variant="contained" onClick={handleGenerateSchedule} sx={marginSpacing}>
					Generate new schedule
				</Button>
				<Button className="create-button" variant="outlined" onClick={handleSaveSchedule} sx={marginSpacing}>
					Save schedule
				</Button>
				<Button className="create-button" variant="outlined" onClick={retrieveSchedule} sx={marginSpacing}>
					Retrieve latest schedule
				</Button>
				<TimeRangeSetter
					workingHoursStart={workingHoursStart}
					workingHoursEnd={workingHoursEnd}
					setWorkingHoursStart={handleChangeWorkingHoursStart}
					setWorkingHoursEnd={handleChangeWorkingHoursEnd}
				/>

				<Scheduler
					events={scheduledTasks}
					month={{
						startHour: workingHoursStart.getHours() as DayHours,
						endHour: workingHoursEnd.getHours() as DayHours,
						weekDays: [0, 1, 2, 3, 4, 5],
						weekStartOn: 6,
					}}
					week={{
						startHour: workingHoursStart.getHours() as DayHours,
						endHour: workingHoursEnd.getHours() as DayHours,
						weekDays: [0, 1, 2, 3, 4, 5],
						weekStartOn: 6,
						step: 60,
					}}
					day={{
						startHour: workingHoursStart.getHours() as DayHours,
						endHour: workingHoursEnd.getHours() as DayHours,
						step: 60,
					}}
				/>
		</div>) : (<div>No tasks to schedule. Make sure you checked 'Include in schedule' field in tasks you want to schedule.</div>)
}
