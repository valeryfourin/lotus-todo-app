import { SyntheticEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import { DayHours } from "@aldabil/react-scheduler/types";
import { Accordion, AccordionDetails, Button } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { collection, doc, orderBy, query } from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { authUser, firestore } from "../../../firebase";
import { saveSchedule, saveWorkingHours } from "../../../services/firestore/boardService";
import { selectedProjectSelector } from "../../store";
import { LoadingIcon } from "../../styledComponents";
import { generateSchedule, getEventsWithStartAndEndDateToBeScheduled, convertEventsToBeScheduled } from "../utils/calendarUtils";
import { TCalendarEvent, TNotification } from "../../types";
import { TimeRangeSetter } from "./TimeRangeSetter";
import { confirmClearScheduleMessage, confirmRetrieveScheduleMessage, confirmSaveScheduleMessage, dateTimeOptions, defaultNotificationDuration, defaultNotificationState } from "../../../utils/constants";
import { CalendarEventEditor } from "./CalendarEventEditor";
import { AccordionSummary } from "./AccordionSummary";
import { preventProjectSwitch } from "../../../utils/helpers";
import ConfirmDialog from "./ConfirmDialog";
import Notification from "../../common/Notification";

import "./calendar.css";

export const Calendar = () => {
	const selectedProject = useSelector(selectedProjectSelector);

	const { events, setEvents, view, setView } = useScheduler();

	const [scheduledTasks, setScheduledTasks] = useState<any>([]);

	const [workingHoursStart, setWorkingHoursStart] = useState<Date>(new Date(new Date().setHours(8, 0, 0, 0)));
	const [workingHoursEnd, setWorkingHoursEnd] = useState<Date>(new Date(new Date().setHours(17, 0, 0, 0)));

	const [notification, setNotification] = useState<TNotification>(defaultNotificationState);

	const [tasks, areTasksLoading] = useCollectionData(query(
		collection(firestore, `users/${authUser.currentUser?.uid}/boards/${selectedProject.id}/tasks`), orderBy('createdAt')));

	const [board, isBoardLoading] = useDocumentData(
		doc(firestore, `users/${authUser.currentUser?.uid}/boards`, selectedProject.id ?? ' ')
	);

	useEffect(() => {
		if (board?.schedule && tasks?.length) {
			setSchedule(convertEventsToBeScheduled(board.schedule));
		} else if (!isBoardLoading) {
			if (!areTasksLoading && tasks?.length) {
				setSchedule(getEventsWithStartAndEndDateToBeScheduled(tasks));
			}
		}

		if (board?.workingHours?.length) {
			if (board.workingHours[0].toDate().getTime() >= board.workingHours[1].toDate().getTime()) {
				return;
			}

			setWorkingHoursStart(board.workingHours[0].toDate());
			setWorkingHoursEnd(board.workingHours[1].toDate());
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [board, tasks, isBoardLoading, areTasksLoading]);

	const handleGenerateSchedule = (event: SyntheticEvent): void => {
		preventProjectSwitch(event);
		if (tasks?.length) {
			const newSchedule = generateSchedule(tasks, workingHoursStart, workingHoursEnd);
			setSchedule(newSchedule);
		}
	};

	const handleSaveSchedule = (): void => {
		saveSchedule(selectedProject.id, events as TCalendarEvent[]);
		displayNotification('Schedule saved', 'success');
	};

	const handleChangeWorkingHoursStart = (newWorkingHoursStart: Date): void => {
		saveWorkingHours(selectedProject.id, [newWorkingHoursStart, workingHoursEnd]);
		setWorkingHoursStart(newWorkingHoursStart);
	};

	const handleChangeWorkingHoursEnd = (newWorkingHoursEnd: Date): void => {
		saveWorkingHours(selectedProject.id, [workingHoursStart, newWorkingHoursEnd]);
		setWorkingHoursEnd(newWorkingHoursEnd);
	};

	const setSchedule = (newSchedule: TCalendarEvent[]): void => {
		setEvents(newSchedule);
		setScheduledTasks(newSchedule);
	};

	const applyChanges = () => {
		setView(view); // workaround to re-render calendar
	};

	const retrieveSchedule = (): void => {
		if (board?.schedule) {
			setSchedule(convertEventsToBeScheduled(board.schedule));
			displayNotification('Previous saved schedule retrieved', 'success');
		} else {
			displayNotification('No previously saved schedule found', 'info');
		}
	};

	const handleClearSchedule = (): void => {
		setSchedule([]);
		displayNotification('Schedule cleared', 'info');
	};

	const displayNotification = (message: string, severity: string): void => {
		setNotification({show: true, message, severity});
		setTimeout(() => {
			setNotification(defaultNotificationState);
		}, defaultNotificationDuration);
	};

	return areTasksLoading
		? (<LoadingIcon />)
		: (<>
			{notification.show && <Notification show={notification.show} message={notification.message} severity={notification.severity} />}
			{ !scheduledTasks?.length && (
				<div className="empty-calendar-message">No tasks to schedule. Make sure you checked 'Include in schedule' field in tasks you want to schedule and try <b>'Generate new schedule'</b> again.</div>
			)}
			<div className="calendar-wrap custom-scroll">
				<Accordion sx={{boxShadow: 'none'}}>
					<AccordionSummary className="calendar-controls" sx={{justifyContent: 'unset'}}>
						<Button className="calendar-button" variant="contained" onClick={handleGenerateSchedule} sx={{marginRight: '10px'}}>
							Generate new schedule
						</Button>
						<ConfirmDialog title="Save schedule" message={confirmSaveScheduleMessage} onConfirm={handleSaveSchedule} />
						<ConfirmDialog title="Retrieve latest schedule" message={confirmRetrieveScheduleMessage} onConfirm={retrieveSchedule} />
						<ConfirmDialog title="Clear schedule" message={confirmClearScheduleMessage} onConfirm={handleClearSchedule} icon={<ClearIcon />}/>
					</AccordionSummary>

					<AccordionDetails>
						<TimeRangeSetter
							workingHoursStart={workingHoursStart}
							workingHoursEnd={workingHoursEnd}
							setWorkingHoursStart={handleChangeWorkingHoursStart}
							setWorkingHoursEnd={handleChangeWorkingHoursEnd}
						/>
						<Button className="calendar-button" variant="contained" onClick={applyChanges} sx={{margin: '10px 0 0 10px'}}>
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
						weekDays: [0, 1, 2, 3, 4, 5, 6],
						weekStartOn: 1,
					}}
					week={{
						startHour: workingHoursStart.getHours() as DayHours,
						endHour: workingHoursEnd.getHours() as DayHours,
						weekDays: [0, 1, 2, 3, 4, 5, 6],
						weekStartOn: 1,
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
				/>
			</div>
		</>)
}
