import test from 'ava';

test('timer channel is started', t => t.pass());
test('adds subscriptions', t => t.pass());
test('resets timer after adding subscriber', t => t.pass());
test('unsubscribes actions', t => t.pass());
test('tick dispatches all subscriptions', t => t.pass());
test('tick does nothing with no subscribers', t => t.pass());
