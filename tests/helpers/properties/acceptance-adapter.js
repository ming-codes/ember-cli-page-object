import startApp from '../start-app';
import { module as qunitModule } from 'qunit';

export { test as testForAcceptance } from 'qunit';

import Ember from 'ember';

let noop = function() {};

export function AcceptanceAdapter() {
  this.originalVisit = window.visit;
}

AcceptanceAdapter.prototype = {
  name: 'acceptance',

  $(selector, isAlternative) {
    return Ember.$(selector, isAlternative ? '#alternate-ember-testing' : '#ember-testing');
  },

  visit(fn) {
    window.visit = fn;
  },

  revert() {
    window.visit = this.originalVisit;
  },

  createTemplate(test, page, template, options) {
    template = template || '';

    if (!(test && page)) {
      console.error('Missing parameters in adapter.createTemplate(testContext, pageObject, templateString)');
    }

    fixture(template, options);
  },

  throws(assert, block, expected, message) {
    let done = assert.async();

    block().then().catch((error) => {
      assert.ok(expected.test(error.toString()), message);
    }).finally(done);
  },

  andThen(fn) {
    andThen(fn);
  },

  wait() {
    return wait();
  }
};

export function fixture(str, options = {}) {
  if (options.useAlternateContainer) {
    $('#alternate-ember-testing').html(str);
  } else {
    $('#ember-testing').html(`<section>${str}</section>`);
  }
}

export function moduleForAcceptance(name, options = {}) {
  let beforeEach = options.beforeEach || noop;
  let afterEach  = options.afterEach || noop;

  qunitModule(name, {
    beforeEach() {
      this.application = startApp();
      beforeEach.call(this);
    },

    afterEach() {
      afterEach.call(this);

      Ember.run(this.application, 'destroy');

      // Cleanup DOM
      $('#ember-testing').html('');
      $('#alternate-ember-testing').html('');
    }
  });
}
