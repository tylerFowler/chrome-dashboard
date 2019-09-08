import { buffers, EventChannel, eventChannel } from 'redux-saga';
import { call, race, take, select } from 'redux-saga/effects';
import { getFeedRefreshInterval } from './settings/selectors';

const refreshChan = (interval: number) => eventChannel(publish => {
  const intervalId = setInterval(() => publish(true), interval);

  return () => clearInterval(intervalId);
}, buffers.none());

export default function* startRefreshLoop() {
  const refreshIntervalMinutes = yield select(getFeedRefreshInterval);

  const chan: EventChannel<any> = yield call(refreshChan, refreshIntervalMinutes * 60 * 1000);
  while (true) {
    yield race({
      tick: take(chan),
    });

    console.debug('Ticking refresher...');
  }
}
