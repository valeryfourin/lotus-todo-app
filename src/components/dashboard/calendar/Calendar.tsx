import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import { DayHours, ProcessedEvent } from "@aldabil/react-scheduler/types";
import { Accordion, AccordionDetails, Button } from "@mui/material";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { authUser, firestore } from "../../../firebase";
import { saveSchedule, saveWorkingHours } from "../../../services/firestore/boardService";
import { selectedProjectSelector } from "../../store";
import { LoadingIcon } from "../../styledComponents";
import { getTasksSchedule, getEventsToBeScheduled, convertEventsToBeScheduled } from "../utils/calendarUtils";
import { TCalendarEvent } from "../../types";
import { TimeRangeSetter } from "./TimeRangeSetter";
import { dateTimeOptions, smallMarginSpacing } from "../../../utils/constants";
import { CalendarEventEditor } from "./CalendarEventEditor";
import { AccordionSummary } from "./AccordionSummary";
import "./calendar.css";

export const Calendar = () => {
	const selectedProject = useSelector(selectedProjectSelector);

	const { events, setEvents, view, setView } = useScheduler();

	const [scheduledTasks, setScheduledTasks] = useState<any>([]);

	const [workingHoursStart, setWorkingHoursStart] = useState<Date>(new Date(new Date().setHours(8, 0, 0, 0)));
	const [workingHoursEnd, setWorkingHoursEnd] = useState<Date>(new Date(new Date().setHours(17, 0, 0, 0)));

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
			if (board.workingHours[0].toDate().getTime() >= board.workingHours[1].toDate().getTime()) {
				return;
			}

			setWorkingHoursStart(board.workingHours[0].toDate());
			setWorkingHoursEnd(board.workingHours[1].toDate());
		}
	}, [board, tasks, isBoardLoading, areTasksLoading]);

	const handleGenerateSchedule = (): void => {
		if (tasks?.length) {
			console.log(getTasksSchedule(tasks, workingHoursStart, workingHoursEnd));
			setEvents(getTasksSchedule(tasks, workingHoursStart, workingHoursEnd));
			setScheduledTasks(getTasksSchedule(tasks, workingHoursStart, workingHoursEnd));
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

	const applyWorkingHours = () => {
		setView(view); // workaround to re-render calendar
	};

	const retrieveSchedule = (): void => {
		if (board?.schedule) {
			setScheduledTasks(convertEventsToBeScheduled(board.schedule));
			alert('Previous saved schedule retrieved');
		} else {
			alert('No previously saved schedule found');
		}
	};

	const handleEventClick = (event: ProcessedEvent): void => {
		console.log(event)
	};

	return areTasksLoading
		? (<LoadingIcon />)
		: scheduledTasks?.length ? (
			<div className="calendar-wrap custom-scroll">
				<Accordion sx={{boxShadow: 'none'}}>
					<AccordionSummary className="calendar-controls" sx={{justifyContent: 'unset'}}>
						<Button className="calendar-button" variant="contained" onClick={handleGenerateSchedule} sx={{marginRight: '10px'}}>
							Generate new schedule
						</Button>
						<Button className="calendar-button" variant="outlined" onClick={handleSaveSchedule} sx={{marginRight: '10px'}}>
							Save schedule
						</Button>
						<Button className="calendar-button" variant="outlined" onClick={retrieveSchedule} sx={{marginRight: '10px'}}>
							Retrieve latest schedule
						</Button>
					</AccordionSummary>

					<AccordionDetails>
						<TimeRangeSetter
							workingHoursStart={workingHoursStart}
							workingHoursEnd={workingHoursEnd}
							setWorkingHoursStart={handleChangeWorkingHoursStart}
							setWorkingHoursEnd={handleChangeWorkingHoursEnd}
						/>
						<Button className="calendar-button" variant="contained" onClick={applyWorkingHours} sx={{margin: '10px 0 0 10px'}}>
							Apply
						</Button>
					</AccordionDetails>
				</Accordion>


				<Scheduler
					events={scheduledTasks}
					hourFormat="24"
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
					customEditor={(scheduler) => <CalendarEventEditor scheduler={scheduler} />}
					viewerExtraComponent={(fields, event) => {
						return (
						<div>
							<p>{event.description}</p>
							<p>{event.priority && `Priority: ${event.priority}`}</p>
							<p>{event.deadline && `Deadline: ${event.deadline.toLocaleDateString("en-US", dateTimeOptions)}`}</p>
						</div>
						);
					}}
					onEventClick={handleEventClick}
				/>
		</div>) : (<div>No tasks to schedule. Make sure you checked 'Include in schedule' field in tasks you want to schedule.</div>)
}
