import { Dashboard } from "../dashboard";
import { Sidebar } from "../sidebar";

import './Home.css';

export const Home = (): JSX.Element => {
    return (
        <div className="home-screen">
            <Sidebar />
            <Dashboard />
        </div>
        );
}