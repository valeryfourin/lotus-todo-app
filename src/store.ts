import { configureStore, Store } from "@reduxjs/toolkit";
import { dashboardReducer } from "./components/store/reducer";
import { TDashboardState } from "./components/types";

function createStore(): Store<TDashboardState> {
    const store = configureStore({reducer: dashboardReducer});
    return store;
}

export const store = createStore();
