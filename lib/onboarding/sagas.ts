import { all, select, call, put, delay, takeLatest, debounce } from 'redux-saga/effects';
import { Actions } from './actions';
import * as action from './actions';

function* storeProgress() { yield new Error('not implemented'); }

function* restoreProgress() {
  try {
    // TODO: load & deserialize
  } catch (err) {
    console.warn('Unable to restore onboarding progress:', err);
    yield put(action.progressRestorationFailure(err));
  }
}

export default function* rootSaga() {
  yield call(restoreProgress);

  yield takeLatest(Actions.CompleteTooltip, storeProgress);
}
