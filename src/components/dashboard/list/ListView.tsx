import { Container, TextField } from '@mui/material';
import { useState } from 'react';
import { List } from './List';

import "./List.css";
import { ListHeader } from './ListHeader';

export const ListView = (): JSX.Element => {
	const [items, setItems] = useState();

    return (
        <>
			<TextField className="search-query" sx={{ marginBottom: '20px', width: 400}} id="standard-basic" label="Search for tasks..." variant="standard" />
			<ListHeader />
			<List />
		</>
	);
};
