import test from 'ava';
import { startRefreshLoop, refreshChan, RefreshActions } from './autorefresh';
import { select, call } from 'redux-saga/effects';
import { getFeedRefreshInterval } from './settings/selectors';
import { eventChannel, EventChannel, runSaga, stdChannel } from 'redux-saga';
import { defaultState as defaultSettingsState } from './settings/reducer';

test('timer channel is started', assert => {
  const saga = startRefreshLoop();

  assert.deepEqual(
    saga.next().value,
    select(getFeedRefreshInterval),
    'retrieves feed refresh interval from settings state',
  );

  const chanRefreshMinutes = 1;
  const chanRefreshMs = 60_000;
  assert.deepEqual(
    saga.next(chanRefreshMinutes as any).value,
    call(refreshChan, chanRefreshMs),
    'calls refresh channel creator with correct minute value',
  );
});

class MockTicker {
  public readonly chan: EventChannel<boolean>;
  private publishFn: (val: any) => void;
  public onCleanup: Function;

  constructor() {
    this.chan = eventChannel(publish => {
      this.publishFn = publish;

      return () => (() => this.onCleanup && this.onCleanup())();
    });
  }

  public tick() { this.publishFn(true); }
}

const runRefreshSaga = () => {
  const channel = stdChannel();

  let mockTicker: MockTicker;
  const createMockTicker = () => {
    mockTicker = new MockTicker();
    return mockTicker.chan;
  };

  const dispatchedActions = [];
  const saga = runSaga({
    channel,
    dispatch(action) { dispatchedActions.push(action); },
    getState() {
      return { settings: { ...defaultSettingsState }};
    },
  }, startRefreshLoop, createMockTicker);

  return {
    channel,
    saga,
    dispatchedActions,
    getMockTicker() { return mockTicker; },
  };
};

test('adds subscriptions', async assert => {
  assert.plan(3);

  const subName = 'test_subscription';
  const subAction = { type: 'TEST_ACTION', payload: 'test' };

  const { channel, saga, dispatchedActions, getMockTicker } = runRefreshSaga();

  getMockTicker().onCleanup = () => assert.pass('ticker reset after subscription added');
  channel.put(RefreshActions.subscribe(subName, subAction));

  getMockTicker().tick(); // trigger the dispatch

  saga.cancel();
  await saga.toPromise();

  assert.is(dispatchedActions.length, 1, 'only one action dispatched');
  assert.deepEqual(dispatchedActions[0], subAction, 'dispatches subscribed action');
});

test('unsubscribes actions', async assert => {
  const { channel, saga, dispatchedActions, getMockTicker } = runRefreshSaga();

  channel.put(RefreshActions.subscribe('test_sub', { type: 'TEST' }));
  channel.put(RefreshActions.unsubscribe('test_sub'));
  getMockTicker().tick();

  saga.cancel();
  await saga.toPromise();
  assert.pass();

  assert.deepEqual(dispatchedActions, [], 'unsubscribed action was not dispatched');
});

test('tick dispatches all subscriptions', async assert => {
  const subActions = [
    { type: 'TEST_ACTION_ONE', payload: 1 },
    { type: 'TEST_ACTION_TWO', payload: 2 },
    { type: 'TEST_ACTION_THREE', payload: 3 },
  ];

  const { channel, saga, dispatchedActions, getMockTicker } = runRefreshSaga();

  channel.put(RefreshActions.subscribe('one', subActions[0]));
  channel.put(RefreshActions.subscribe('two', subActions[1]));
  channel.put(RefreshActions.subscribe('three', subActions[2]));

  getMockTicker().tick(); // trigger the dispatch

  saga.cancel();
  await saga.toPromise();

  assert.is(dispatchedActions.length, subActions.length,
    'all subscriptions were dispatched',
  );

  assert.deepEqual(dispatchedActions, subActions,
    'dispatches all subscribed actions, in order',
  );
});

test('tick does nothing with no subscribers', async assert => {
  const { saga, dispatchedActions, getMockTicker } = runRefreshSaga();

  getMockTicker().tick(); // trigger the dispatch

  saga.cancel();
  await saga.toPromise();

  assert.deepEqual(dispatchedActions, [], 'no actions were dispatched for no subscriptions');
});
