const express = require('express');

const { auth } = require('./middlewares/authMiddlewares');
const {
  getBeadData,
  getAllBeadData,
  postBeadData,
} = require('./middlewares/beadMiddlewares');
const {
  endOfGetReq,
  endOfPostReq,
} = require('./controllers/responseControllers');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(auth, getAllBeadData, endOfGetReq)
  .post(auth, postBeadData, endOfPostReq);

router.route('/:beadId').get(auth, getBeadData, endOfGetReq);

module.exports = router;
