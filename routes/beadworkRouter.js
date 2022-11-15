const express = require('express');

const { auth } = require('./middlewares/authMiddlewares');
const { getBeadworkData } = require('./middlewares/beadworkMiddlewares');
const { endOfGetReq } = require('./controllers/responseControllers');

const router = express.Router({ mergeParams: true });

router.route('/:beadworkId').get(auth, getBeadworkData, endOfGetReq);

module.exports = router;
