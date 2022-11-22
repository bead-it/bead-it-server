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

describe('02. Bead test', () => {
  it('start', async () => {
    backupData = await backupOriginalData();
    await deleteTestData();
    await createTestData();
  });

  it('02-1. Get bead data with valid beadId.', done => {
    requestApp
      .get(
        '/users/637cbc4c71a61ffc5a10acee/beadworks/637492f5bc1aff2ace0a2191/beads/6374964d690ff5cb4a2f7394',
      )
      .expect(200)
      .expect(res => {
        expect(res.body.result).equal('ok');
        expect(res.body.data).to.deep.include({
          _id: '6374964d690ff5cb4a2f7394',
          tags: ['tag1', 'tag2'],
          comments: [],
          beadwork: '637492f5bc1aff2ace0a2191',
        });
        expect(res.body.data.page).to.deep.include({
          _id: '6374956747bbe1f1e03519ff',
          active: true,
          domain: 'pks2974.medium.com',
          url: 'https://pks2974.medium.com/iframe-간단-정리하기-1cd866b71c8f',
          title:
            'iframe 간단 정리하기. iframe 을 사용해볼 일이 생겨, 이참에 잘 모르고 있던… | by 박성룡 ( Andrew park ) | Medium',
          keywords: ['keyword1'],
          refs: [],
          backRefs: [],
          comments: [],
        });
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('02-2. Get bead data with invalid beadworkId.', done => {
    requestApp
      .get(
        '/users/637cbc4c71a61ffc5a10acee/beadworks/637492f5bc1aff2ace0a2190/beads/6374964d690ff5cb4a2f7394',
      )
      .expect(400)
      .expect({
        result: 'error',
        code: 400,
        message:
          'Error occured in backend server : Error in getBeadData in beadMiddlewares.js : BeadworkId is not matched with beadId!!',
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('02-3. Get all beads data with valid beadworkId.', done => {
    requestApp
      .get(
        '/users/637cbc4c71a61ffc5a10acee/beadworks/637492f5bc1aff2ace0a2191/beads',
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

  it('02-4. Get all beads data with invalid beadworkId.', done => {
    requestApp
      .get(
        '/users/637cbc4c71a61ffc5a10acee/beadworks/637492f5bc1aff2ace0a2190/beads',
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

  it('02-5. Post bead with valid beadworkId and data', done => {
    requestApp
      .post(
        '/users/637cbc4c71a61ffc5a10acee/beadworks/637492f5bc1aff2ace0a2191/beads',
      )
      .send({
        domain: 'domain_xx',
        url: 'url_xx',
        title: 'title_xx',
        keywords: ['keyword_1', 'keyword_2'],
      })
      .expect(201)
      .expect(res => {
        expect(res.body.result).equal('ok');
        expect(res.body.data).to.deep.includes({
          tags: [],
          comments: [],
          beadwork: '637492f5bc1aff2ace0a2191',
        });
        expect(res.body.data.page).to.deep.includes({
          active: true,
          domain: 'domain_xx',
          url: 'url_xx',
          title: 'title_xx',
          keywords: ['keyword_1', 'keyword_2'],
          refs: [],
          backRefs: [],
          comments: [],
        });
      })
      .end(error => {
        if (error) done(error);
        done();
      });
  });

  it('02-6. Patch bead with valid data', done => {
    requestApp
      .patch(
        '/users/637cbc4c71a61ffc5a10acee/beadworks/637492f5bc1aff2ace0a2191/beads/6374964d690ff5cb4a2f7394',
      )
      .send({
        tags: ['newtag_1', 'newtag_2', 'newtag_3'],
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
