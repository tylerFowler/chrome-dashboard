import { retry, select, call, put, takeLatest } from 'redux-saga/effects';
import applicationStore from 'lib/storage';
import { Actions } from './actions';
import * as action from './actions';
import { SerializableOnboardingProgress, deserializeProgress, serializeProgress } from './selectors';

const storageKey = 'onboardingProgress';

function* storeProgress() {
  const serializableProgress: SerializableOnboardingProgress = yield select(serializeProgress);

  try {
    yield retry(3, 2.5 * 1000, applicationStore.setData, storageKey, serializableProgress);
  } catch (err) {
    console.warn('Unable to store onboarding progress:', err);
    yield put(action.progressStorageFailure(err));
  }
}

function* restoreProgress() {
  try {
    const serializedProgress: SerializableOnboardingProgress =
      yield retry(2, 5 * 1000, applicationStore.getData, storageKey);

    if (serializedProgress) {
      const deserializedProgress = deserializeProgress(serializedProgress);
      yield put(action.restoreProgress(deserializedProgress));
    }
  } catch (err) {
    console.warn('Unable to restore onboarding progress:', err);
    yield put(action.progressRestorationFailure(err));

    // if we can't know the user's progression through onboarding, err on the side
    // of not annoying the user with messages that they *may* have seen
    console.warn('Disabling onboarding as progress is unknown');
    yield put(action.disableOnboarding());
  }
}

export default function* rootSaga() {
  yield call(restoreProgress);

  yield takeLatest(Actions.CompleteTooltip, storeProgress);
}
