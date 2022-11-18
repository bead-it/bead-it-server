const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');
const {
  createTestData,
  deleteTestData,
  backupOriginalData,
  restoreOriginalData,
} = require('./testUtils');

const requestApp = request.agent(app);
let backupData;

describe('03. Thread test', () => {
  it('start', async () => {
    backupData = await backupOriginalData();
    await deleteTestData();
    await createTestData();
  });

  it('03-1. Get thread data with valid threadId.', done => {
    requestApp
      .get(
        '/users/6374905f40e097569b7dd970/beadworks/637492f5bc1aff2ace0a2191/threads/63749732486fe6325f548f2a',
      )
      .expect(200)
      .expect(res => {
        expect(res.body.result).equal('ok');
        expect(res.body.data).to.deep.include({
          _id: '63749732486fe6325f548f2a',
          source: '6374964d690ff5cb4a2f7394',
          target: '6374964d690ff5cb4a2f7395',
          content: 'this is thread 1',
          beadwork: '637492f5bc1aff2ace0a2191',
        });
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('03-2. Get thread data with invalid beadworkId.', done => {
    requestApp
      .get(
        '/users/6374905f40e097569b7dd970/beadworks/637492f5bc1aff2ace0a2190/threads/63749732486fe6325f548f2a',
      )
      .expect(400)
      .expect({
        result: 'error',
        code: 400,
        message:
          'Error occured in backend server : Error in getThreadData in threadMiddlewares.js : BeadworkId is not matched with threadId!!',
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('03-3. Get all threads data with valid beadworkId.', done => {
    requestApp
      .get(
        '/users/6374905f40e097569b7dd970/beadworks/637492f5bc1aff2ace0a2191/threads/',
      )
      .expect(200)
      .expect(res => {
        expect(res.body.result).equal('ok');
        expect(res.body.data.length).equal(10);
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('03-4. Get all threads data with invalid beadworkId.', done => {
    requestApp
      .get(
        '/users/6374905f40e097569b7dd970/beadworks/637492f5bc1aff2ace0a2190/beads',
      )
      .expect(400)
      .expect({
        result: 'error',
        code: 400,
        message:
          'Error occured in backend server : Error in getAllBeadData in beadMiddlewares.js : Invalid beadworkId!!',
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('03-5. Post thread with valid beadworkId and data.', done => {
    requestApp
      .post(
        '/users/6374905f40e097569b7dd970/beadworks/637492f5bc1aff2ace0a2191/threads',
      )
      .send({
        source: '6374964d690ff5cb4a2f7395',
        target: '6374964d690ff5cb4a2f7394',
      })
      .expect(201)
      .expect(res => {
        expect(res.body.result).equal('ok');
        expect(res.body.data).to.deep.include({
          source: '6374964d690ff5cb4a2f7395',
          target: '6374964d690ff5cb4a2f7394',
          content: '',
          beadwork: '637492f5bc1aff2ace0a2191',
        });
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('03-6. Patch thread with valid beadworkId and data.', done => {
    requestApp
      .patch(
        '/users/6374905f40e097569b7dd970/beadworks/637492f5bc1aff2ace0a2191/threads/63749732486fe6325f548f2a',
      )
      .send({
        source: '6374964d690ff5cb4a2f7397',
        target: '6374964d690ff5cb4a2f7396',
        content: 'new contents!!',
      })
      .expect(204)
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
