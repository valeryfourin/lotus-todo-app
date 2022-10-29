import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { applyMiddleware, combineReducers, Store } from "redux";
import createSagaMiddleware from "redux-saga";
import { dashboardReducer } from "./components/store/reducer";
import { TDashboardState } from "./components/types";
import { rootSaga } from "./rootSaga";

// export const rootReducer = combineReducers({
//     dashboard: dashboardReducer
// });

//export type TDashboardState = ReturnType<typeof rootReducer>;

function createStore(): Store<TDashboardState> {
    const sagaMiddleware = createSagaMiddleware();
    // const middlewares = composeWithDevToolsDevelopmentOnly(applyMiddleware(sagaMiddleware));
    const store = configureStore({reducer: dashboardReducer, middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)});
    sagaMiddleware.run(rootSaga);
    return store;
}

export const store = createStore();