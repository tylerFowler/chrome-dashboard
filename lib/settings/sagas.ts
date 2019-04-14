import { select, put } from 'redux-saga/effects';
import { getSettings } from './selectors';
import { committed, commitFailure, receiveSettings } from './actions';

const settingsStorageKey = 'settings';

function* commitSettings() {
  const settings = yield select(getSettings);

  try {
    localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
    yield put(committed());
  } catch (err) {
    yield put(commitFailure(err));
  }
}

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

// TODO: need to figure out how to notify other things about commits, maybe a
// hook? Context that this can write to?
// TODO:
// - on COMMIT: commit settings
// - on UPDATE_FEED_SETTING: commit settings
// - on UPDATE_PANEL_SETTING: commit settings
export default function* rootSaga() {
}
