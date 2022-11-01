import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from "./AppRouter";

export default function App() {
  return (
    <div className="app">
      <Router>
        <AppRouter />
      </Router>
    </div>
  );
};
