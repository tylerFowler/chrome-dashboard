import { all, select, call, put, delay, takeLatest, debounce } from 'redux-saga/effects';
import { getWeatherLocationConfig, serializeSettings, deserializeSettings } from './selectors';
import { WeatherLocation, WeatherLocationType } from 'lib/weather/interface';
import * as WeatherAPI from 'lib/weather/api';
import { fetchForecastError } from 'lib/weather/actions';
import { State as Settings } from './reducer';
import applicationStore from 'lib/storage';
import {
  committed, commitFailure, receiveSettings, addToast, Actions, removeToast,
  updateWeatherConfig,
  commit,
  restoreFailure,
  refreshWeatherCoordsFailure,
  refreshWeatherCoordsSuccess,
} from './actions';

const toastDebounce = 500;
const toastLifetime = 3 * 1000;

const settingsKey = 'settings';

function* commitSettings() {
  const serializableSettings = yield select(serializeSettings);

  try {
    yield call(applicationStore.setData, settingsKey, serializableSettings);

    yield put(committed());
  } catch (err) {
    yield put(commitFailure(err));
  }
}

function* restoreSettings() {
  try {
    const serializedSettings: Settings = yield call(applicationStore.getData, settingsKey);

    if (serializedSettings) {
      const deserializedSettings = deserializeSettings(serializedSettings);
      yield put(receiveSettings(deserializedSettings));
    }
  } catch (err) {
    console.warn('Unable to load settings:', err);
    yield put(restoreFailure(err));
  }
}

function* settingsStoredToast() {
  yield put(addToast('Settings saved'));
  yield delay(toastLifetime);
  yield put(removeToast());
}

function* refreshCurrentLocationIfEnabled() {
  const weatherLocType: WeatherLocation = yield select(getWeatherLocationConfig);
  if (weatherLocType.type !== WeatherLocationType.Current) {
    return;
  }

  const getCurrentPosition = () =>
    new Promise<Coordinates>((resolve, reject) => navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve(coords);
      }, err => reject(err),
    ),
  );

  const locationConfig: WeatherLocation.Coords = yield select(getWeatherLocationConfig);
  const positionUpdatedLoc: WeatherLocation = { ...locationConfig };

  try {
    const { latitude, longitude } = yield call(getCurrentPosition);
    positionUpdatedLoc.value = { lat: latitude, lon: longitude };

    yield put(refreshWeatherCoordsSuccess());
  } catch (error) {
    let msg = 'Failed to retrieve location';

    const posErr = error as PositionError; // can't narrow the type in the catch clause
    switch (posErr.code) {
    case posErr.PERMISSION_DENIED:
      msg = 'Permissio denied';
      break;
    case posErr.POSITION_UNAVAILABLE:
      msg = 'Location is unavailable at this time';
      break;
    case posErr.TIMEOUT:
      msg = 'Timed out waiting to refresh location';
      break;
    }

    yield put(refreshWeatherCoordsFailure(new Error(msg)));
    return;
  }

  try {
    let coordsName = '';
    try {
      const { city } = yield call(WeatherAPI.fetchCurrentWeather, positionUpdatedLoc, 'F');

      if (city && city.name) {
        coordsName = city.name;
      }
    } catch (error) {
      console.warn('Unable to determine location name from coordinates', error);
    }

    yield put(updateWeatherConfig({ location: { ...positionUpdatedLoc,
      displayName: coordsName, // reset display name as the location has changed
      countryCode: null, // coordinates should not populate country code
    }}));

    yield put(commit());
  } catch {
    // there's no good place to put this, either we push an error to the weather
    // module or the weather module modifies settings so for now this is where it
    // will go
    yield put(fetchForecastError(new Error('Unable to detect your current location')));
  }
}

export default function* rootSaga() {
  yield call(restoreSettings);
  yield all([
    takeLatest(Actions.Commit, commitSettings),
    debounce(toastDebounce, Actions.UpdateFeedConfiguration, commitSettings),
    debounce(toastDebounce, Actions.UpdatePanelConfiguration, commitSettings),
    debounce(toastDebounce, Actions.UpdatePanelType, commitSettings),
    debounce(toastDebounce, Actions.UpdateWeatherConfiguration, commitSettings),
    takeLatest(Actions.RefreshWeatherCoordinates, refreshCurrentLocationIfEnabled),
    takeLatest(Actions.Committed, settingsStoredToast),
  ]);
}
