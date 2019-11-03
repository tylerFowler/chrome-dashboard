import { takeEvery, call, put } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as API from './api';
import { Actions, fetchForecast as fetchForecastAction, recvForecast, fetchForecastError } from './actions';
import { WeatherLocation } from './interface';

function* fetchForecast(action: ActionType<typeof fetchForecastAction>) {
  const { location, unit } = action.payload;

  if (!location.value) {
    return;
  } else if (WeatherLocation.isCoords(location)) {
    if (!location.value.lat || !location.value.lon) {
      return;
    }
  }

  try {
    const { current, future } = yield call(API.fetchForecasts, location, unit);
    yield put(recvForecast(current, future));
  } catch (error) {
    console.error('An error occurred while fetching the weather forecast', error);
    yield put(fetchForecastError(new Error('There was a problem fetching your forecast')));
  }
}

export default function* rootSaga() {
  yield takeEvery(Actions.FetchForecast, fetchForecast);
}
