import { SyntheticEvent, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import SwipeableViews from 'react-swipeable-views';
import { ListView } from './list';
import { GridView } from './grid';
import { Calendar } from './calendar';
import { Stats } from './stats';
import { ITabPanelProps } from '../types';
import { useTheme } from '@mui/material';



function TabPanel(props: ITabPanelProps) {
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
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
	  <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        // onChangeIndex={handleChangeIndex}
      >
		<TabPanel value={value} index={0}>
			<GridView />
		</TabPanel>
		<TabPanel value={value} index={1}>
			<ListView />
		</TabPanel>
		<TabPanel value={value} index={2}>
			<Calendar />
		</TabPanel>
		<TabPanel value={value} index={3}>
			<Stats />
		</TabPanel>
	  </SwipeableViews>
    </Box>
  );
}
