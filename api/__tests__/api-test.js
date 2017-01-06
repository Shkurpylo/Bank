import { expect } from 'chai';
import { mapUrl } from '../utils/url';
import mongoose from 'mongoose';
import config from '../../src/config';
import util from 'util';

mongoose.Promise = global.Promise;

describe('mapUrl', () => {
  it('extracts nothing if both params are undefined', () => {
    expect(mapUrl(undefined, undefined)).to.deep.equal({
      action: null,
      params: []
    });
  });

  it('extracts nothing if the url is empty', () => {
    const url = '';
    const splittedUrlPath = url.split('?')[0].split('/').slice(1);
    const availableActions = { a: 1, cards: { c: 1, load: () => 'baz' } };

    expect(mapUrl(availableActions, splittedUrlPath)).to.deep.equal({
      action: null,
      params: []
    });
  });

  it('extracts nothing if nothing was found', () => {
    const url = '/cards/getCards/?foo=bar';
    const splittedUrlPath = url.split('?')[0].split('/').slice(1);
    const availableActions = { a: 1, info: { c: 1, load: () => 'baz' } };

    expect(mapUrl(availableActions, splittedUrlPath)).to.deep.equal({
      action: null,
      params: []
    });
  });

  it('extracts the available actions and the params from an relative url string with GET params', () => {
    const url = '/cards/getCards/param1/xzy?foo=bar';
    const splittedUrlPath = url.split('?')[0].split('/').slice(1);
    const availableActions = { a: 1, cards: { c: 1, getCards: () => 'baz' } };

    expect(mapUrl(availableActions, splittedUrlPath)).to.deep.equal({
      action: availableActions.cards.getCards,
      params: ['param1', 'xzy']
    });
  });

  it('extracts the available actions from an url string without GET params', () => {
    const url = '/cards/getCards/?foo=bar';
    const splittedUrlPath = url.split('?')[0].split('/').slice(1);
    const availableActions = { a: 1, cards: { c: 1, getCards: () => 'baz' } };

    expect(mapUrl(availableActions, splittedUrlPath)).to.deep.equal({
      action: availableActions.cards.getCards,
      params: ['']
    });
  });

  it('does not find the avaialble action if deeper nesting is required', () => {
    const url = '/cards';
    const splittedUrlPath = url.split('?')[0].split('/').slice(1);
    const availableActions = { a: 1, cards: { c: 1, load: () => 'baz' } };

    expect(mapUrl(availableActions, splittedUrlPath)).to.deep.equal({
      action: null,
      params: []
    });
  });
});

const db = config.db;
const mLab = util.format('mongodb://%s:%s@%s:%s/%s', db.user, db.password, db.host, db.port, db.name);


describe('MongoDB Conection', function() {
  it('connect to MongoDB', function(done) {
    return mongoose.connect(mLab, () => {
      done();
    });
  });
});
