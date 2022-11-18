const express = require('express');
const { expect } = require('chai');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const { authTemp } = require('../routes/middlewares/authMiddlewares');

const testExpress = express();
testExpress.use(
  '/users/:userId/test-1',
  authTemp,
  (req, res) => res.status(200).json({ result: 'ok' }),
  // eslint-disable-next-line no-unused-vars
  (err, req, res, next) => {
    const responseBody = {
      result: 'error',
      code: err.status || 500,
      message: err.message,
    };

    res.status(responseBody.code).json(responseBody);
  },
);

describe('04. Authentication test', () => {
  it('04-1. Pass auth middleware with valid token.', done => {
    const testToken = jwt.sign(
      { test: 'This is test token', email: 'ltg0513@gmail.com' },
      process.env.SECRET_KEY,
    );

    request
      .agent(testExpress)
      .get('/users/6375dfeb8d8386b5205a9b4b/test-1')
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)
      .expect({ result: 'ok' })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('04-2. Not pass auth middleware with invalid token.', done => {
    const testToken = 'nono';

    request
      .agent(testExpress)
      .get('/users/6375dfeb8d8386b5205a9b4b/test-1')
      .set('Authorization', `Bearer ${testToken}`)
      .expect(401)
      .expect(res => {
        expect(res.body).to.deep.include({
          result: 'error',
          code: 401,
        });
        expect(res.body.message).to.include('Invalid token delivered!!');
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });
});
