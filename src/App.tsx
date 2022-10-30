import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from "./AppRouter";
import 'materialize-css/dist/css/materialize.min.css';

export default function App() {
  return (
    <div className="app">
      <Router>
        <AppRouter />
      </Router>
    </div>
  );
};
