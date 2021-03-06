import Ember from 'ember';
import { test, module } from 'qunit';
import { create } from 'ember-cli-page-object';
import {
  throwBetterError
} from 'ember-cli-page-object/-private/better-errors';

const page = create({
  foo: {
    scope: '.foo',
    bar: {
      scope: '.bar',
      focus() {}
    }
  }
});

module('Unit | throwBetterError');

test('shows the expected error message when `selector` is not passed in', function(assert) {
  assert.expect(1);

  const fn = () => {
    throwBetterError(page.foo.bar, 'focus', 'Oops!');
  };
  const expectedError = new Ember.Error(
    "Oops!\n\nPageObject: 'page.foo.bar.focus'"
  );

  assert.throws(fn, expectedError, 'should show message & property path');
});

test('shows the expected error message when `selector` is passed in', function(assert) {
  assert.expect(1);

  const fn = () => {
    throwBetterError(page.foo.bar, 'focus', 'Oops!', { selector: '.foo .bar' });
  };
  const expectedError = new Ember.Error(
    "Oops!\n\nPageObject: 'page.foo.bar.focus'\n  Selector: '.foo .bar'"
  );

  assert.throws(fn, expectedError, 'should show message, property path, & selector');
});

test('logs the error to the console', function(assert) {
  assert.expect(2);

  const origEmberLoggerError = Ember.Logger.error;

  try {
    Ember.Logger.error = (msg) => {
      assert.equal(msg, "Oops!\n\nPageObject: 'page.foo.bar.focus'");
    };

    assert.throws(() => throwBetterError(page.foo.bar, 'focus', 'Oops!'));
  } finally {
    Ember.Logger.error = origEmberLoggerError;
  }
});
