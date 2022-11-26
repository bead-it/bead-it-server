const { expect } = require('chai');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('../app');
const {
  createTestData,
  deleteTestData,
  backupOriginalData,
  restoreOriginalData,
} = require('./testUtils');

const requestApp = request.agent(app);
let backupData;

const testToken = jwt.sign(
  { test: 'This is test token', email: 'ltg0513@gmail.com' },
  process.env.PRIVATE_KEY,
  { algorithm: 'RS256' },
);

describe('05. User test', () => {
  it('start', async () => {
    backupData = await backupOriginalData();
    await deleteTestData();
    await createTestData();
  });

  it('05-1. Get user data with valid userId.', done => {
    requestApp
      .get('/users/637cbc4c71a61ffc5a10acee')
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)
      .expect(res => {
        expect(res.body.result).equal('ok');
        expect(res.body.data).to.deep.include({
          username: 'Taegeun Lim',
          email: 'ltg0513@gmail.com',
          googleId: 'bAECw98pXzYdMv4lMPg63JwPbGe2',
          profile:
            'https://lh3.googleusercontent.com/a/ALm5wu1T3n5hxZffiXm5oLkBmMJc-STXDPFIYVvvtUoz=s96-c',
        });
        expect(res.body.data.myBeadworks.length).equal(1);
        expect(res.body.data.sharedBeadworks.length).equal(1);
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('05-2. Get user data with invalid userId.', done => {
    requestApp
      .get('/users/637cbc4c71a61ffc5a10aced')
      .set('Authorization', `Bearer ${testToken}`)
      .expect(400)
      .expect({
        result: 'error',
        code: 400,
        message:
          'Error occured in backend server : Error in auth in authMiddlewares.js : Invalid userId delivered!!',
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('end', async () => {
    await deleteTestData();
    await restoreOriginalData(backupData);
  });
});
