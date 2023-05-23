import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

interface IDateTimeSetterProps {
	value: Date | null;
	setValue: Function;
	label: string;
	saveDay?: boolean;
}

export default function DateTimeSetter({value, setValue, label, saveDay = true}: IDateTimeSetterProps) {
	const handleChange = (date: any) => {
		if (date) {
			setValue(new Date(date.$y, date.$M, date.$D, date.$H, date.$m));
		}
	};

	return saveDay ? (
		<DateTimePicker
			label={label}
			value={value}
			onChange={handleChange}
			ampm={false}
			renderInput={(params: any) => <TextField {...params} />}
		/>
		) : (
			<TimePicker
				label={label}
				value={value}
				onChange={handleChange}
				ampm={false}
				renderInput={(params) => <TextField {...params} />}
			/>
		);

}
