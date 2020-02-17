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

// TODO: this needs to check the local storage and prioritize that over whatever
// is in sync'd chrome storage, which is what will always be loaded first
// - however, when refreshing we should never write to sync'd storage, instead
//   we should write to local storage
//   - But then will any value ever make it to chrome sync'd storage? when?
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

// TODO: Settings have just been restored, check to see if we have weather type set to
// "current" and, if so, check to see if there are coordinates in local storage
// and update location to be that (but don't cause the new location to be committed)
function* attemptToLoadLocalWeatherSettings() {
  throw new Error('not implemented');
}

export default function* rootSaga() {
  // TODO: this will dispatch a 'recvSettings' action, we should look for this
  // and create an effect that will fill in the weatehr coords w/ the ones from
  // local storage if we have some
  yield call(restoreSettings);

  // TODO: if weather type == current & a lot/lon exists, we should assume that
  // we're allowed to refresh the location willy nilly and should do so now,
  // by dispaching refreshIfEnabled
  // - But, caveat, this will be probably too frequent so we might need to set a
  // "last refresh time" and go off of that

  yield all([
    takeLatest(Actions.Commit, commitSettings),
    debounce(toastDebounce, Actions.UpdateFeedConfiguration, commitSettings),
    debounce(toastDebounce, Actions.UpdatePanelConfiguration, commitSettings),
    debounce(toastDebounce, Actions.UpdatePanelType, commitSettings),
    debounce(toastDebounce, Actions.UpdateWeatherConfiguration, commitSettings),
    takeLatest(Actions.ReceiveSettings, attemptToLoadLocalWeatherSettings),
    takeLatest(Actions.RefreshWeatherCoordinates, refreshCurrentLocationIfEnabled),
    takeLatest(Actions.Committed, settingsStoredToast),
  ]);
}
