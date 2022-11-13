import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Priority, PriorityColor } from '../../../types';
import { deleteTask } from '../../../../services/firestore/taskService';
import { useSelector } from 'react-redux';
import { selectedProjectSelector } from '../../../store';

interface ITaskProps {
	id: string;
	name: string;
	columnId: string;
	description: string;
	deadline: Date | null;
	priority: string;
};

export const Task = ({ id, name, columnId, description, deadline, priority }: ITaskProps) => {
    const selectedProject = useSelector(selectedProjectSelector);

	const handleClick = () => {
		console.log(selectedProject.id, columnId, id);

		deleteTask(selectedProject.id, columnId, id)
	}
    return (
        <Card className="task-card" variant="outlined" onClick={handleClick}>
            <CardContent>
            	<Button size="small">{ name }</Button>

				<Typography variant="body2">
					{description}
				</Typography>
			</CardContent>
			<CardActions>
				Due: <Button size="small">{deadline?.toDateString()}</Button>
				<Typography variant="body2" color={PriorityColor[priority as Priority]}>{priority}</Typography>
			</CardActions>
        </Card>
    );
};
