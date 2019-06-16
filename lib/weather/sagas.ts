import { takeEvery, call, put, select } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as API from './api';
import { Actions, fetchForecast as fetchForecastAction, recvForecast, fetchForecastError } from './actions';
import { getWeatherAPIKey } from '../settings/selectors';

function* fetchForecast(action: ActionType<typeof fetchForecastAction>) {
  const apiKey = yield select(getWeatherAPIKey);
  const { location, unit } = action.payload;

  try {
    const { current, future } = yield call(API.fetchForecasts, location, apiKey, unit);
    yield put(recvForecast(current, future));
  } catch (error) {
    yield put(fetchForecastError(error));
  }
}

export default function* rootSaga() {
  yield takeEvery(Actions.FetchForecast, fetchForecast);
}
