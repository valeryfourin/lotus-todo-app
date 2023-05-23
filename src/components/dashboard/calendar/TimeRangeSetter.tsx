import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

interface IDateTimeSetterProps {
	workingHoursStart: Date;
	workingHoursEnd: Date;
	setWorkingHoursStart: Function;
	setWorkingHoursEnd: Function;
}

export function TimeRangeSetter({workingHoursStart, workingHoursEnd, setWorkingHoursStart, setWorkingHoursEnd}: IDateTimeSetterProps) {

	const handleStartChange = (date: any) => {
		if (date) {
			setWorkingHoursStart(new Date(date.$y, date.$M, date.$D, date.$H, date.$m));
		}
	};

	const handleEndChange = (date: any) => {
		if (date) {
			setWorkingHoursEnd(new Date(date.$y, date.$M, date.$D, date.$H, date.$m));
		}
	};

	return (<>
		<TimePicker
			label="Choose working hours start:"
			value={workingHoursStart}
			onChange={handleStartChange}
			ampm={false}
			renderInput={(params) => <TextField {...params} className="time-range-field" sx={{ margin: '0 10px', minWidth: '200px'}}/>}
		/>
		<TimePicker
			label="Choose working hours end:"
			value={workingHoursEnd}
			onChange={handleEndChange}
			ampm={false}
			renderInput={(params) => <TextField {...params} className="time-range-field" sx={{ margin: '0 10px', minWidth: '200px'}}/>}
		/>
	</>);
}
