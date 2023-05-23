import { Box, CircularProgress } from "@mui/material";

export const LoadingIcon = () => {
	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
			<CircularProgress />
		</Box>)
};
