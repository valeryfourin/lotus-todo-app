import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

interface IDateTimeSetterProps {
	value: Date[] | null;
	setValue: Function;
	label: string;
}

export default function TimeRangeSetter({value, setValue, label}: IDateTimeSetterProps) {
	const handleChange = (date: any) => {
		if (date) {
			setValue(new Date(date.$y, date.$M, date.$D, date.$H, date.$m));
		}
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<TimePicker
				label={label}
				value={value}
				onChange={handleChange}
				renderInput={(params) => <TextField {...params} />}
			/>
			<TimePicker
				label={label}
				value={value}
				onChange={handleChange}
				renderInput={(params) => <TextField {...params} />}
			/>
		</LocalizationProvider>
	);
}
