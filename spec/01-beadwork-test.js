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

describe('01. Beadwork test', () => {
  it('start', async () => {
    backupData = await backupOriginalData();
    await deleteTestData();
    await createTestData();
  });

  it('01-1. Get beadwork data with valid beadworkId.', done => {
    requestApp
      .get('/users/6374905f40e097569b7dd970/beadworks/637492f5bc1aff2ace0a2191')
      .expect(200)
      .expect(res => {
        expect(res.body.result).equal('ok');
        expect(res.body.data).to.deep.include({
          _id: '637492f5bc1aff2ace0a2191',
          title: 'first beadwork!',
          description: 'beadwork 1!!',
          author: '6374905f40e097569b7dd970',
          beads: [
            '6374964d690ff5cb4a2f7394',
            '6374964d690ff5cb4a2f7395',
            '6374964d690ff5cb4a2f7396',
            '6374964d690ff5cb4a2f7397',
            '6374964d690ff5cb4a2f7398',
            '6374964d690ff5cb4a2f7399',
            '6374964d690ff5cb4a2f739a',
            '6374964d690ff5cb4a2f739b',
            '6374964d690ff5cb4a2f739c',
            '6374964d690ff5cb4a2f739d',
          ],
          threads: [
            '63749732486fe6325f548f2a',
            '63749732486fe6325f548f2b',
            '63749732486fe6325f548f2c',
            '63749732486fe6325f548f2d',
            '63749732486fe6325f548f2e',
            '63749732486fe6325f548f2f',
            '63749732486fe6325f548f30',
            '63749732486fe6325f548f31',
            '63749732486fe6325f548f32',
            '63749732486fe6325f548f33',
          ],
        });
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('01-2. Get beadwork data with invalid beadworkId.', done => {
    requestApp
      .get('/users/6374905f40e097569b7dd970/beadworks/637492f5bc1aff2ace0a2190')
      .expect(400)
      .expect({
        result: 'error',
        code: 400,
        message:
          'Error occured in backend server : Error in getBeadworkData in beadworkMiddlewares.js : Invalid beadworkId!!',
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('01-3. Post beadwork with valid userId.', done => {
    requestApp
      .post('/users/6374905f40e097569b7dd970/beadworks')
      .expect(201)
      .expect(res => {
        expect(res.body.result).equal('ok');
        expect(res.body.data).to.deep.include({
          title: 'untitled',
          description: '',
          author: '6374905f40e097569b7dd970',
          beads: [],
          threads: [],
        });
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('01-4. Post beadwork with invalid userId.', done => {
    requestApp
      .post('/users/6374905f40e097569b7dd969/beadworks')
      .expect(400)
      .expect({
        result: 'error',
        code: 400,
        message:
          'Error occured in backend server : Error in postBeadworkData in beadworkMiddlewares.js : Invalid userId!!',
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('01-5. Patch beadwork with valid userId and beadworkId.', done => {
    requestApp
      .patch(
        '/users/6374905f40e097569b7dd970/beadworks/637492f5bc1aff2ace0a2191',
      )
      .send({
        title: 'title1',
        description: 'description1',
      })
      .expect(200)
      .expect({
        result: 'ok',
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('01-6. Patch beadwork with invalid userId and beadworkId.', done => {
    requestApp
      .patch(
        '/users/6374905f40e097569b7dd969/beadworks/637492f5bc1aff2ace0a2191',
      )
      .send({
        title: 'title1',
        description: 'description1',
      })
      .expect(400)
      .expect({
        result: 'error',
        code: 400,
        message:
          'Error occured in backend server : Error in patchBeadworkData in beadworkMiddlewares.js : UserId is not matched with beadworkId!!',
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('01-7. Patch beadwork without body data.', done => {
    requestApp
      .patch(
        '/users/6374905f40e097569b7dd970/beadworks/637492f5bc1aff2ace0a2191',
      )
      .expect(400)
      .expect({
        result: 'error',
        code: 400,
        message:
          'Error occured in backend server : Error in patchBeadworkData in beadworkMiddlewares.js : No data delivered!!',
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
