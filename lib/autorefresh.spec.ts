import test from 'ava';
import { startRefreshLoop, refreshChan } from './autorefresh';
import { select, call } from 'redux-saga/effects';
import { getFeedRefreshInterval } from './settings/selectors';

test.only('timer channel is started', assert => {
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

test('adds subscriptions', t => t.pass());
test('resets timer after adding subscriber', t => t.pass());
test('unsubscribes actions', t => t.pass());
test('tick dispatches all subscriptions', t => t.pass());
test('tick does nothing with no subscribers', t => t.pass());
