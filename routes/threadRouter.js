const express = require('express');

const { auth } = require('./middlewares/authMiddlewares');
const {
  getThreadData,
  getAllThreadData,
} = require('./middlewares/threadMiddlewares');
const { endOfGetReq } = require('./controllers/responseControllers');

const router = express.Router({ mergeParams: true });

router.route('/').get(auth, getAllThreadData, endOfGetReq);

router.route('/:threadId').get(auth, getThreadData, endOfGetReq);

module.exports = router;
