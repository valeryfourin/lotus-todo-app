import { SagaIterator } from 'redux-saga';
import { call, all} from 'redux-saga/effects';
import { watchLoadAppData } from './store/sagas';

export function* rootSaga(): SagaIterator {
    const sagas = [
        call(watchLoadAppData),
        //call(),
    ];

    yield all(sagas);
}