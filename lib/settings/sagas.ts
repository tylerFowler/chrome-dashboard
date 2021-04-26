import { all, select, call, put, delay, takeLatest, debounce } from 'redux-saga/effects';
import { getWeatherLocationConfig, serializeSettings, deserializeSettings, getWeatherUnits } from './selectors';
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
  restoreSuccess,
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

    yield put(restoreSuccess());
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

const localLocationCacheKey = 'currentLocation';
const locationCacheLengthMs = 60 * 60 * 1000; // 1 hour

interface LocationCache {
  location: WeatherLocation.Coords;
  cachedAt: Date|string;
}

function* cacheLocalCoordinates(location: WeatherLocation.Coords) {
  const cachedAt = new Date();

  const locationCache: LocationCache = { location, cachedAt: cachedAt.toISOString() };
  applicationStore.setData(localLocationCacheKey, locationCache, false);
}

function* useCachedLocalCoordinatesIfAvailable() {
  const { type }: WeatherLocation = yield select(state => getWeatherLocationConfig(state));
  if (type !== WeatherLocationType.Current) {
    return;
  }

  const cachedLocation: LocationCache = yield call(applicationStore.getData, localLocationCacheKey, true);
  if (cachedLocation && WeatherLocation.isCoords(cachedLocation.location)) {
    yield put(updateWeatherConfig({ location: cachedLocation.location }));
  }
}

function* getLocalCoordinatesCacheDate() {
  const cachedLocation: LocationCache = yield call(applicationStore.getData, localLocationCacheKey, true);
  if (cachedLocation) {
    return new Date(cachedLocation.cachedAt);
  }
}

// TODO: write tests for this
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
      const weatherUnit = yield select(getWeatherUnits);
      const { city } = yield call(WeatherAPI.fetchCurrentWeather, positionUpdatedLoc, weatherUnit);

      if (city && city.name) {
        coordsName = city.name;
      }
    } catch (error) {
      console.warn('Unable to determine location name from coordinates', error);
    }

    const locationUpdate: WeatherLocation = { ...positionUpdatedLoc,
      displayName: coordsName, // reset display name as the location has changed
      countryCode: null, // coordinates should not populate country code
    };

    yield put(updateWeatherConfig({ location: locationUpdate }));

    // commit after updating the weather configuration, new devices will now use
    // that particular location, though it's not terribly vital that we commit now
    yield put(commit());

    yield call(cacheLocalCoordinates, locationUpdate);
  } catch {
    // there's no good place to put this, either we push an error to the weather
    // module or the weather module modifies settings so for now this is where it
    // will go
    yield put(fetchForecastError(new Error('Unable to detect your current location')));
  }
}

function* refreshLocationIfStale() {
  const cachedAt: Date = yield call(getLocalCoordinatesCacheDate);

  // if we have no cache don't attempt to refresh, can't guarantee that location
  // permissions have been given for this device
  if (!cachedAt) {
    return;
  }

  const isStale = (new Date()).valueOf() - cachedAt.valueOf() > locationCacheLengthMs;
  if (isStale) {
    yield call(refreshCurrentLocationIfEnabled);
  }
}

export default function* rootSaga() {
  yield call(restoreSettings);
  yield call(refreshLocationIfStale);

  yield all([
    takeLatest(Actions.Commit, commitSettings),
    debounce(toastDebounce, Actions.UpdateFeedConfiguration, commitSettings),
    debounce(toastDebounce, Actions.UpdatePanelConfiguration, commitSettings),
    debounce(toastDebounce, Actions.UpdatePanelType, commitSettings),
    debounce(toastDebounce, Actions.UpdateWeatherConfiguration, commitSettings),
    takeLatest(Actions.ReceiveSettings, useCachedLocalCoordinatesIfAvailable),
    takeLatest(Actions.RefreshWeatherCoordinates, refreshCurrentLocationIfEnabled),
    takeLatest(Actions.Committed, settingsStoredToast),
  ]);
}
