/* eslint-env mocha */

'use strict';

const request = require('supertest');
const express = require('express');

const middleware = require('../index');

function createServer(options) {
  var app = express();
  middleware(app);
  return app;
}

describe('ft-express-web-service', function() {
  describe('default options', function() {
    it('has a /__gtg endpoint which returns 200', function(done) {
      var server = createServer();
      request(server)
        .get('/__gtg')
        .expect("Cache-Control", "no-store")
        .expect("Content-Type", "text/plain; charset=utf-8")
        .expect(200, done);
    });

    it('has a /__health endpoint which return JSON with a 200 which follows the schema', function(done) {
      var server = createServer();
      request(server)
        .get('/__health')
        .expect('Cache-Control', 'no-store')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done);
    });

    it('has a /__about endpoint which returns JSON with a 200', function(done) {
      var server = createServer();
      request(server)
        .get('/__about')
        .expect('Cache-Control', 'no-store')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done);
    });

    it('has a /__error endpoint which returns JSON with a 200', function(done) {
      var server = createServer();
      request(server)
        .get('/__error')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(500, done);
    });
  });
});