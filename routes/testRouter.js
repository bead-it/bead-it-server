const express = require('express');
const {
  createTestData,
  deleteTestData,
  backupOriginalData,
} = require('../spec/testUtils');

const router = express.Router();

router.route('/').post(async (req, res, next) => {
  try {
    await deleteTestData();
    await createTestData();
    res.json({ result: 'ok' });
  } catch (error) {
    error.message = `Error in testRouter.js : ${error.message}`;

    next(error);
  }
});

router.route('/all-data').get(async (req, res, next) => {
  try {
    const data = await backupOriginalData();
    res.json({
      result: 'ok',
      data,
    });
  } catch (error) {
    error.message = `Error in testRouter.js : ${error.message}`;

    next(error);
  }
});

module.exports = router;
