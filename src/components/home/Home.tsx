import { Dashboard } from "../dashboard";
import { Sidebar } from "../sidebar";

import './Home.css';

export const Home = (): JSX.Element => {
    return (
        <div className="home-screen">
          {/* <span>Hi, {user?.email ?? 'user'}!</span>
          <Loader />
          <button type="button" onClick={updateName}>Update name</button>
          <button type="button" onClick={() => dispatch(logout())}>Sign out</button>
            <Header /> */}
            <Sidebar />
            <Dashboard />
        </div>
        );
}