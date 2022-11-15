const express = require('express');

const { auth } = require('./middlewares/authMiddlewares');
const { getBeadworkData } = require('./middlewares/beadworkMiddlewares');
const { endOfGetReq } = require('./controllers/responseControllers');

const router = express.Router();

router.route('/:beadworkId').get(auth, getBeadworkData, endOfGetReq);
