const express = require('express');

const { auth } = require('./middlewares/authMiddlewares');
const {
  getBeadworkData,
  postBeadworkData,
  patchBeadworkData,
  copyBeadworkContents,
} = require('./middlewares/beadworkMiddlewares');
const {
  endOfGetReq,
  endOfPostReq,
  endOfPatchReq,
} = require('./controllers/responseControllers');

const router = express.Router({ mergeParams: true });

router.route('/').post(auth, postBeadworkData, endOfPostReq);

router
  .route('/:beadworkId')
  .get(auth, getBeadworkData, endOfGetReq)
  .post(auth, postBeadworkData, copyBeadworkContents, endOfPostReq)
  .patch(auth, patchBeadworkData, endOfPatchReq);

module.exports = router;
