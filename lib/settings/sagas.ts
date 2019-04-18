import { all, select, call, put, delay, takeLatest, debounce } from 'redux-saga/effects';
import { getSerializableSettings } from './selectors';
import { committed, commitFailure, receiveSettings, addToast, Actions, removeToast } from './actions';

// TODO: create some pluggable functions for getting & setting to/from local
// storage, export saga generator creators that inject this for writing tests
// - then write tests

const settingsStorageKey = 'settings';
const toastDebounce = 500;
const toastLifetime = 2 * 1000;

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

export default function* rootSaga() {
  yield call(restoreSettings);
  yield all([
    takeLatest(Actions.Commit, commitSettings),
    debounce(toastDebounce, Actions.UpdateFeedConfiguration, commitSettings),
    debounce(toastDebounce, Actions.UpdatePanelConfiguration, commitSettings),
    takeLatest(Actions.Committed, settingsStoredToast),
  ]);
}
