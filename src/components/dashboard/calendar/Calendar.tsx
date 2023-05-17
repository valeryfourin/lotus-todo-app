import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import { Button, DialogActions, TextField } from "@mui/material";
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
import { dateTimeOptions, smallMarginSpacing } from "../../../utils/constants";
import { DayHours, ProcessedEvent, SchedulerHelpers } from "@aldabil/react-scheduler/types";

import "./calendar.css";
import { EditDialog } from "../../task/EditDialog";
import { PopupCreateButton } from "../popupCreateButton/PopupCreateButton";

export const Calendar = () => {
	const selectedProject = useSelector(selectedProjectSelector);

	const { setEvents, events } = useScheduler();

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

	const click = () => {
		setWorkingHoursStart(workingHoursStart);
		setWorkingHoursEnd(workingHoursEnd);
	}

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
	}

	return areTasksLoading
		? (<LoadingIcon />)
		: scheduledTasks?.length ? (
			<div className="calendar-wrap custom-scroll">
				<div className="calendar-controls">
					<Button className="calendar-button" variant="contained" onClick={handleGenerateSchedule} sx={smallMarginSpacing}>
						Generate new schedule
					</Button>
					<Button className="calendar-button" variant="outlined" onClick={handleSaveSchedule} sx={smallMarginSpacing}>
						Save schedule
					</Button>
					<Button className="calendar-button" variant="outlined" onClick={retrieveSchedule} sx={smallMarginSpacing}>
						Retrieve latest schedule
					</Button>
				</div>

				<div>
					<TimeRangeSetter
						workingHoursStart={workingHoursStart}
						workingHoursEnd={workingHoursEnd}
						setWorkingHoursStart={handleChangeWorkingHoursStart}
						setWorkingHoursEnd={handleChangeWorkingHoursEnd}
					/>
					<Button className="calendar-button" variant="contained" onClick={click} sx={{margin: '10px 0 0 10px'}}>
						Apply
					</Button>
				</div>

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
					customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
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

interface CustomEditorProps {
	scheduler: SchedulerHelpers;
}

const CustomEditor = ({ scheduler }: CustomEditorProps) => {
	const event = scheduler.edited;

	// Make your own form/state
	const [state, setState] = useState({
		title: event?.title || "",
		description: event?.description || ""
	});
	const [error, setError] = useState("");

	const handleChange = (value: string, name: string) => {
		setState((prev) => {
			return {
				...prev,
				[name]: value
			};
		});
	};
	const handleSubmit = async () => {
		// Your own validation
		if (state.title.length < 3) {
			return setError("Min 3 letters");
		}

		try {
			scheduler.loading(true);

			/**Simulate remote data saving */
			const added_updated_event = (await new Promise((res) => {
			/**
			 * Make sure the event have 4 mandatory fields
			 * event_id: string|number
			 * title: string
			 * start: Date|string
			 * end: Date|string
			 */
				setTimeout(() => {
					res({
					event_id: event?.event_id || Math.random(),
					title: state.title,
					start: scheduler.state.start.value,
					end: scheduler.state.end.value,
					description: state.description
					});
				}, 3000);
			})) as ProcessedEvent;

			scheduler.onConfirm(added_updated_event, event ? "edit" : "create");
			scheduler.close();
		} finally {
			scheduler.loading(false);
		}
	};

	const EditEventDialog = () => {};

	const CreateEventDialog = () => {};

	return (
		<div>
			<div style={{ padding: "1rem" }}>
				<TextField
					label="Title"
					value={state.title}
					onChange={(e) => handleChange(e.target.value, "title")}
					error={!!error}
					helperText={error}
					fullWidth
				/>
				<TextField
					label="Description"
					value={state.description}
					onChange={(e) => handleChange(e.target.value, "description")}
					fullWidth
				/>
			</div>
			<DialogActions>
				<Button onClick={scheduler.close}>Cancel</Button>
				<Button onClick={handleSubmit}>Confirm</Button>
			</DialogActions>
		</div>
	);
};
