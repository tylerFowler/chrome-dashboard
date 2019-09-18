import { all, select, call, put, delay, takeLatest, debounce } from 'redux-saga/effects';
import { getSerializableSettings, getWeatherLocationConfig } from './selectors';
import { WeatherLocation, WeatherLocationType } from 'lib/weather/interface';
import * as WeatherAPI from 'lib/weather/api';
import { fetchForecastError } from 'lib/weather/actions';
import { SettingsStore } from './storage';
import LocalStorageSettingsStore from './storage/localStorage';
import ChromeStorageSettingsStore from './storage/chromeStorage';
import { State as Settings } from './reducer';
import {
  committed, commitFailure, receiveSettings, addToast, Actions, removeToast,
  updateWeatherConfig,
  commit,
  restoreFailure,
} from './actions';

// this global variable should be inserted by the build tooling to determine what
// should be used as the settings storage mechanism
declare var __SETTINGS_STORE__: string;

// TODO: if possible we want to do conditional importing
let settingsStore: SettingsStore;
switch (__SETTINGS_STORE__) {
case 'chromeStorage':
  settingsStore = new ChromeStorageSettingsStore();
  break;
case 'localstorage':
default:
  settingsStore = new LocalStorageSettingsStore();
  break;
}

const toastDebounce = 500;
const toastLifetime = 3 * 1000;

function* commitSettings() {
  const settings = yield select(getSerializableSettings);

  try {
    yield call(settingsStore.commitSettings, settings);

    yield put(committed());
  } catch (err) {
    yield put(commitFailure(err));
  }
}

function* restoreSettings() {
  try {
    const settings: Settings = yield call(settingsStore.restoreSettings);

    if (settings) {
      yield put(receiveSettings(settings));
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
