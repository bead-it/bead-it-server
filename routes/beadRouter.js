const express = require('express');

const { auth } = require('./middlewares/authMiddlewares');
const {
  getBeadData,
  getAllBeadData,
} = require('./middlewares/beadMiddlewares');
const { endOfGetReq } = require('./controllers/responseControllers');

const router = express.Router();

router.route('/').get(auth, getAllBeadData, endOfGetReq);

router.route('/:beadId').get(auth, getBeadData, endOfGetReq);
