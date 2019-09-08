import { AnyAction } from 'redux';
import { action } from 'typesafe-actions';
import { buffers, EventChannel, eventChannel } from 'redux-saga';
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
  const refreshIntervalMinutes = yield select(getFeedRefreshInterval);

  const subscriptions = new Map<string, AnyAction>();

  const chan: EventChannel<any> = yield call(refreshChan, refreshIntervalMinutes * 60 * 1000);
  while (true) {
    const { tick, registerSubscriber, unsubscribe } = yield race({
      tick: take(chan),
      registerSubscriber: take(ActionType.RegisterSubscriber),
      unsubscribe: take(ActionType.Unsubscribe),
    });

    if (tick) {
      console.log('Dispatching all subscribers...');
      for (const [ , refreshAction ] of subscriptions) {
        console.log('Dispatching', refreshAction);
        yield put(refreshAction);
      }

      continue;
    }

    if (registerSubscriber) {
      console.log('Adding subscriber ', registerSubscriber);
      subscriptions.set(registerSubscriber.meta.name, registerSubscriber.payload);

      continue;
    }

    if (unsubscribe) {
      console.log('Unsubscribing', unsubscribe);
      subscriptions.delete(unsubscribe.meta.name);

      continue;
    }
  }
}

export default function* rootSaga() {
  yield spawn(startRefreshLoop);
}
