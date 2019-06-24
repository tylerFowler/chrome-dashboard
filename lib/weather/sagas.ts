import { takeEvery, call, put, select } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import * as API from './api';
import { Actions, fetchForecast as fetchForecastAction, recvForecast, fetchForecastError } from './actions';
import { getWeatherAPIKey } from '../settings/selectors';
import { updateWeatherLocationName } from '../settings/actions';

function* fetchForecast(action: ActionType<typeof fetchForecastAction>) {
  const apiKey = yield select(getWeatherAPIKey);
  const { location, unit } = action.payload;

  try {
    const { current, future, city } = yield call(API.fetchForecasts, location, apiKey, unit);
    yield put(recvForecast(current, future));

    if (city && city.name) {
      yield put(updateWeatherLocationName(city.name));
    }
  } catch (error) {
    console.error('An error occurred while fetching the weather forecast', error);
    yield put(fetchForecastError(new Error('There was a problem fetching your forecast')));
  }
}

export default function* rootSaga() {
  yield takeEvery(Actions.FetchForecast, fetchForecast);
}
