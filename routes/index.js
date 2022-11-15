const express = require('express');

const router = express.Router();

const beadworkRouter = require('./beadworkRouter');
const beadRouter = require('./beadRouter');
const threadRouter = require('./threadRouter');
const testRouter = require('./testRouter');

router.use('/users/:userId/beadworks', beadworkRouter);
router.use('/users/:userId/beadworks/:beadworkId/beads', beadRouter);
router.use('/users/:userId/beadworks/:beadworkId/threads', threadRouter);

router.use('/test', testRouter);

module.exports = router;
