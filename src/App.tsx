import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from "./AppRouter";

export default function App() {
  return (
    <div className="todo-app container">
      <Router>
        <AppRouter />
      </Router>
    </div>
  );
};
