import { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


interface IDateTimeSetterProps {
	value: Date | null;
	setValue: Function;
	label: string;
	saveDay: boolean;
}

export default function DateTimeSetter({value, setValue, label, saveDay}: IDateTimeSetterProps) {
	const handleChange = (date: any) => {
		if (date) {
			setValue(new Date(date.$y, date.$M, date.$D, date.$H, date.$m));
		}
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			{ saveDay ? (
				<DateTimePicker
					label={label}
					value={value}
					onChange={handleChange}
					renderInput={(params) => <TextField {...params} />}
				/>
				) : (
					<TimePicker
						label={label}
						value={value}
						onChange={handleChange}
						renderInput={(params) => <TextField {...params} />}
					/>
				)
			}
		</LocalizationProvider>
	);
}
