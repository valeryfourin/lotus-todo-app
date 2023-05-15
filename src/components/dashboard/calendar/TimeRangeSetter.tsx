import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

interface IDateTimeSetterProps {
	workingHoursStart: Date;
	workingHoursEnd: Date;
	setWorkingHoursStart: Function;
	setWorkingHoursEnd: Function;
}

const defaultDate = [new Date('January 1, 1970 8:00:00'), new Date('January 1, 1970 17:00:00')];

export default function TimeRangeSetter({workingHoursStart, workingHoursEnd, setWorkingHoursStart, setWorkingHoursEnd}: IDateTimeSetterProps) {
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

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<TimePicker
				label="Choose working hours start:"
				value={workingHoursStart}
				onChange={handleStartChange}
				renderInput={(params) => <TextField {...params} className="time-range-field" sx={{ margin: '0 10px'}}/>}
			/>
			<TimePicker
				label="Choose working hours end:"
				value={workingHoursEnd}
				onChange={handleEndChange}
				renderInput={(params) => <TextField {...params} className="time-range-field" sx={{ margin: '0 10px'}}/>}
			/>
		</LocalizationProvider>
	);
}
