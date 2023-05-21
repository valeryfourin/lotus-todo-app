import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DateSetter({value, setValue}: {value: Date | null, setValue: Function}) {
	const handleChange = (date: any) => {
		if (date) {
			setValue(new Date(date.$y, date.$M, date.$D));
		}
	};

	return (
		<DatePicker
			label="Deadline"
			value={value}
			onChange={handleChange}
			renderInput={(params) => <TextField {...params} />}
		/>
	);
}
