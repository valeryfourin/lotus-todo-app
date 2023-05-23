import { useState } from 'react';
import Box from '@mui/material/Box';
import Alert, { AlertColor } from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { TNotification } from '../types';

export default function Notification({ severity, message, show = false }: TNotification) {
  const [open, setOpen] = useState(show);

  return (
    <Box sx={{ width: '100%' }}>
		{open && (<Alert
			severity={severity as AlertColor}
			action={
				<IconButton
				aria-label="close"
				color="inherit"
				size="small"
				onClick={() => {
					setOpen(false);
				}}
				>
				<CloseIcon fontSize="inherit" />
				</IconButton>
			}
			sx={{ mb: 2 }}
		>
			{message}
		</Alert>)}
    </Box>
  );
}
