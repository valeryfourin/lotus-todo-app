import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TripOriginIcon  from '@mui/icons-material/TripOrigin';
import { Priority } from '../../../types';

export default function PrioritySelect() {
	const [priority, setPriority] = React.useState('');

	const handleChange = (event: SelectChangeEvent) => {
		setPriority(event.target.value as string);
	};

	return (
		<Box sx={{ minWidth: 120 }}>
			<FormControl fullWidth>
				<InputLabel id="demo-simple-select-label">Priority</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={priority}
					margin="dense"
					label="Age"
					onChange={handleChange}
				>
					<MenuItem value={Priority.none}>
						<TripOriginIcon sx={{color: '#a7c3d3'}} className="icon"/>
						Not set
					</MenuItem>
					<MenuItem value={Priority.minor}>
						<TripOriginIcon sx={{color: '#78c480'}}  className="icon"/>
						{Priority.minor}
					</MenuItem>
					<MenuItem value={Priority.major}>
						<TripOriginIcon sx={{color: '#e56724'}} className="icon"/>
						{Priority.major}
					</MenuItem>
					<MenuItem value={Priority.critical}>
						<TripOriginIcon sx={{color: '#bd70bc'}} className="icon"/>
						{Priority.critical}
					</MenuItem>
				</Select>
			</FormControl>
		</Box>
  );
}
