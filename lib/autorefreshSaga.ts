import { AnyAction } from 'redux';
import { action } from 'typesafe-actions';
import { buffers, EventChannel, eventChannel, channel } from 'redux-saga';
import { call, put, race, take, select, spawn } from 'redux-saga/effects';
import { getFeedRefreshInterval } from './settings/selectors';

enum ActionType {
  RegisterSubscriber = 'AUTOREFRESH_SUBSCRIBE',
  Unsubscribe = 'AUTOREFRESH_UNSUBSCRIBE',
}

export namespace Actions {
  export const subscribe = (name: string, refreshAction: AnyAction) =>
    action(ActionType.RegisterSubscriber, refreshAction, { name });

  export const unsubscribe = (name: string) =>
    action(ActionType.Unsubscribe, null, { name });
}

const refreshChan = (interval: number) => eventChannel(publish => {
  const intervalId = setInterval(() => publish(true), interval);

  return () => clearInterval(intervalId);
}, buffers.fixed(1)); // at most keep one tick while main loop is performing other actions

function* startRefreshLoop() {
  const subscriptions = new Map<string, AnyAction>();

  const refreshIntervalMinutes = yield select(getFeedRefreshInterval);
  const newTickChannel = () => call(refreshChan, refreshIntervalMinutes * 60 * 1000);

  let tickChan: EventChannel<any> = yield newTickChannel();
  while (true) {
    const { tick, registerSubscriber, unsubscribe } = yield race({
      tick: take(tickChan),
      registerSubscriber: take(ActionType.RegisterSubscriber),
      unsubscribe: take(ActionType.Unsubscribe),
    });

    if (tick) {
      for (const [, refreshAction ] of subscriptions) {
        yield put(refreshAction);
      }

      continue;
    }

    if (registerSubscriber) {
      subscriptions.set(registerSubscriber.meta.name, registerSubscriber.payload);

      // when a new subscriber is registered we want to avoid situations where
      // it is added and then is refreshed very shortly after, so the timer to
      // the next tick will be restarted each time
      tickChan.close();
      tickChan = yield newTickChannel();
      continue;
    }

    if (unsubscribe) {
      subscriptions.delete(unsubscribe.meta.name);
      continue;
    }
  }
}

export default function* rootSaga() {
  yield spawn(startRefreshLoop);
}
