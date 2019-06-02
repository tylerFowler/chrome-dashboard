import { takeEvery, put } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { Actions, fetchForecast as fetchForecastAction, recvForecast } from './actions';

function* fetchForecast(_: ActionType<typeof fetchForecastAction>) {
  yield put(recvForecast({
    condition: 'clearDay',
    temperature: 80,
  }, {
    condition: 'clearNight',
    temperature: 65,
  }));
}

export default function* rootSaga() {
  yield takeEvery(Actions.FetchForecast, fetchForecast);
}
