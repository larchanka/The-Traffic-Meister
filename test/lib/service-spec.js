'use strict';

const expect = require('chai').expect;
const jsdom = require('jsdom').jsdom;

const doc = jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

const Service = require('../../service/lib/service.js');

describe('Service tests', () => {
  it('should be an object', () => {
    expect(typeof Service).to.equal('object');
  });

  it('should have external method', () => {
    const methodList = [
      'init', 'setEventListeners', 'typeChangeHandler', 'brandChangeHandler', 'colorChangeHandler'
    ];
    expect(Object.keys(Service)).to.deep.equal(methodList);
  });
});
