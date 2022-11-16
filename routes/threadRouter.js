const express = require('express');

const { auth } = require('./middlewares/authMiddlewares');
const {
  getThreadData,
  getAllThreadData,
  postThreadData,
  patchThreadData,
} = require('./middlewares/threadMiddlewares');
const {
  endOfGetReq,
  endOfPostReq,
  endOfPatchReq,
} = require('./controllers/responseControllers');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(auth, getAllThreadData, endOfGetReq)
  .post(auth, postThreadData, endOfPostReq);

router
  .route('/:threadId')
  .get(auth, getThreadData, endOfGetReq)
  .patch(auth, patchThreadData, endOfPatchReq);

module.exports = router;
