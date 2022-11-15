import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TripOriginIcon  from '@mui/icons-material/TripOrigin';
import { Priority, PriorityColor } from '../../types';

export default function PrioritySelect({value, setValue}: {value: string, setValue: Function}): JSX.Element {
	const handleChange = (event: SelectChangeEvent) => {
		setValue(event.target.value as string);
	};

	return (
		<Box sx={{ minWidth: 120 }}>
			<FormControl fullWidth>
				<InputLabel id="demo-simple-select-label">Priority</InputLabel>
				<Select className="select"
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={value}
					margin="dense"
					label="Priority"
					onChange={handleChange}
				>
					{Object.values(Priority).map((priority) => (
						<MenuItem key={priority} value={priority}>
							<TripOriginIcon sx={{color: PriorityColor[priority]}} className="icon"/>
							{priority}
						</MenuItem>
					))}
					{/* <MenuItem value={Priority.notSet}>
						<TripOriginIcon sx={{color: PriorityColor[Priority.notSet]}} className="icon"/>
						{Priority.notSet}
					</MenuItem>
					<MenuItem value={Priority.minor}>
						<TripOriginIcon sx={{color: PriorityColor[Priority.minor]}}  className="icon"/>
						{Priority.minor}
					</MenuItem>
					<MenuItem value={Priority.major}>
						<TripOriginIcon sx={{color: PriorityColor[Priority.major]}} className="icon"/>
						{Priority.major}
					</MenuItem>
					<MenuItem value={Priority.critical}>
						<TripOriginIcon sx={{color: PriorityColor[Priority.critical]}} className="icon"/>
						{Priority.critical}
					</MenuItem> */}
				</Select>
			</FormControl>
		</Box>
  );
}
