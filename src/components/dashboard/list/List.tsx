import { Card, CardContent, Typography } from "@mui/material";

export const List = (): JSX.Element => {
    return (
		<div className="list custom-scroll">

			<Card className="list-item hoverable" variant="outlined" >
			<CardContent>
					<Typography variant="h6" component="div">name </Typography>
					<Typography variant="body2" > description </Typography>
				</CardContent>
			</Card>

			<Card className="list-item hoverable" variant="outlined" >
			<CardContent>
					<Typography variant="h6" component="div">name </Typography>
					<Typography variant="body2" > description </Typography>
				</CardContent>
			</Card>
		</div>
	);
};
