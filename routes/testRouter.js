const express = require('express');
const { createTestData, deleteTestData } = require('../spec/testUtils');

const router = express.Router();

router.route('/').get(async (req, res) => {
  await deleteTestData();
  await createTestData();
  res.json({ result: 'ok' });
});

module.exports = router;
