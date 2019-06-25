import { all, select, call, put, delay, takeLatest, debounce } from 'redux-saga/effects';
import { getSerializableSettings, getWeatherLocationConfig, getWeatherAPIKey } from './selectors';
import { WeatherLocation, WeatherLocationType } from 'lib/weather/interface';
import * as WeatherAPI from 'lib/weather/api';
import { fetchForecastError } from '../weather/actions';
import {
  committed, commitFailure, receiveSettings, addToast, Actions, removeToast,
  updateWeatherConfig,
  commit,
} from './actions';

// TODO: create some pluggable functions for getting & setting to/from local
// storage, export saga generator creators that inject this for writing tests
// - then write tests

const settingsStorageKey = 'settings';
const toastDebounce = 500;
const toastLifetime = 3 * 1000;

function* restoreSettings() {
  try {
    const settings = localStorage.getItem(settingsStorageKey);
    if (settings) {
      yield put(receiveSettings(JSON.parse(settings)));
    }
  } catch (err) {
    console.warn('Unable to load settings:', err);
  }
}

function* commitSettings() {
  const settings = yield select(getSerializableSettings);

  try {
    localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
    yield put(committed());
  } catch (err) {
    yield put(commitFailure(err));
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

  const getCurrentPosition = () => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      resolve(coords);
    }, err => reject(err),
  ));

  const locationConfig: WeatherLocation.Coords = yield select(getWeatherLocationConfig);

  try {
    const { latitude, longitude } = yield call(getCurrentPosition);
    const positionUpdatedLoc: WeatherLocation = { ...locationConfig,
      value: { lat: latitude, lon: longitude },
    };

    let coordsName = '';
    try {
      const apiKey = yield select(getWeatherAPIKey);
      const { city } = yield call(WeatherAPI.fetchCurrentWeather, positionUpdatedLoc, apiKey, 'F');

      if (city && city.name) {
        coordsName = city.name;
      }
    } catch (error) {
      console.warn('Unable to determine location name from coordinates', error);
    }

    yield put(updateWeatherConfig({ location: { ...positionUpdatedLoc,
      displayName: coordsName, // reset display name as the location has changed
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
