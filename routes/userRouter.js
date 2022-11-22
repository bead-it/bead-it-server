const express = require('express');

const { auth } = require('./middlewares/authMiddlewares');
const { getUserData, patchUserData } = require('./middlewares/userMiddlewares');
const {
  endOfGetReq,
  endOfPatchReq,
} = require('./controllers/responseControllers');

const router = express.Router();

router
  .route('/:userId')
  .get(auth, getUserData, endOfGetReq)
  .patch(auth, patchUserData, endOfPatchReq);

module.exports = router;
