import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { dataViewSelector } from '../store';
import { List } from './project/list';
import { Grid } from './project/grid';
import { Calendar } from './project/calendar';
import { Stats } from './project/stats';
import { ViewDataOptions } from './constants';

// const DATA_VIEW = {
//   [ViewData.grid]: Grid
// }

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ViewTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const dataView = useSelector(dataViewSelector);
  // const ViewComponent = DATA_VIEW[dataView];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Grid"  />
          <Tab label="List"  />
          <Tab label="Calendar"  />
          <Tab label="Stats"  />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Grid />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <List />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Calendar />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Stats />
      </TabPanel>
    </Box>
  );
}