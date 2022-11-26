const express = require('express');
const {
  createTestData,
  deleteTestData,
  backupOriginalData,
  restoreOriginalData,
} = require('../spec/testUtils');

const router = express.Router();

router.route('/use-test-data').post(async (req, res, next) => {
  try {
    await deleteTestData();
    await createTestData();
    res.json({ result: 'ok' });
  } catch (error) {
    error.message = `Error in testRouter.js : ${error.message}`;

    next(error);
  }
});

router.route('/backup-data').post(async (req, res, next) => {
  try {
    const data = await backupOriginalData();
    res.json({
      result: 'ok',
      data,
    });
  } catch (error) {
    error.message = `Error in backup in testRouter.js : ${error.message}`;

    next(error);
  }
});

router.route('/restore-data').post(async (req, res, next) => {
  try {
    const { data } = req.body;
    if (!data) {
      const error = new Error('No data for restoring!!');
      error.status = 400;
      throw error;
    }

    await deleteTestData();
    await restoreOriginalData(data);
    res.json({ result: 'ok' });
  } catch (error) {
    error.message = `Error in restoring in testRouter.js : ${error.message}`;

    next(error);
  }
});

router.route('/error-test').get((req, res, next) => {
  const error = new Error('test error!!');
  error.status = 404;
  next(error);
});

module.exports = router;
