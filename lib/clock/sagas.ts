import { call, put } from 'redux-saga/effects';
import { tick } from './actions';

function awaitTick(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(tick()), ms));
}

export default function* rootSaga() {
  while (true) {
    const tickAction = yield call(awaitTick, 15 * 1000);
    yield(put(tickAction));
  }
}
