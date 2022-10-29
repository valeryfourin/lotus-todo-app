import { SagaIterator } from 'redux-saga';
import { call, takeEvery} from 'redux-saga/effects';
import { fetchDashboardData } from '../components/store';

export function* loadAppDataSaga(): SagaIterator {
    try {
        yield call(fetchDashboardData);
    } catch (e) {
        console.error(e);
    }
};

export function* watchLoadAppData(): SagaIterator {
    yield takeEvery('action', loadAppDataSaga);
}