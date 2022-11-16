const express = require('express');

const { auth } = require('./middlewares/authMiddlewares');
const {
  getBeadworkData,
  postBeadworkData,
} = require('./middlewares/beadworkMiddlewares');
const {
  endOfGetReq,
  endOfPostReq,
} = require('./controllers/responseControllers');

const router = express.Router({ mergeParams: true });

router.route('/').post(auth, postBeadworkData, endOfPostReq);

router.route('/:beadworkId').get(auth, getBeadworkData, endOfGetReq);

module.exports = router;
