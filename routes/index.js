const express = require('express');

const router = express.Router();

const userRouter = require('./userRouter');
const beadworkRouter = require('./beadworkRouter');
const beadRouter = require('./beadRouter');
const threadRouter = require('./threadRouter');
const testRouter = require('./testRouter');
const { endOfPostReq } = require('./controllers/responseControllers');
const { login } = require('./middlewares/authMiddlewares');

router.use('/users', userRouter);
router.use('/users/:userId/beadworks', beadworkRouter);
router.use('/users/:userId/beadworks/:beadworkId/beads', beadRouter);
router.use('/users/:userId/beadworks/:beadworkId/threads', threadRouter);

router.use('/test', testRouter);

router.route('/login').post(login, endOfPostReq);

module.exports = router;
