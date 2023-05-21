import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from "./AppRouter";

export default function App() {
  return (
    <div className="app ">
      <Router>
	  	<LocalizationProvider dateAdapter={AdapterDayjs}>
        	<AppRouter />
		</LocalizationProvider>
      </Router>
    </div>
  );
};
