const Bead = require('../models/Bead');
const Beadwork = require('../models/Beadwork');
const Thread = require('../models/Thread');

const beadsData = require('./beadsmockdata');
const beadworksData = require('./beadworksmockdata');
const threadData = require('./threadsmockdata');

const createTestData = async () => {
  try {
    await Bead.insertMany(beadsData);
    await Beadwork.insertMany(beadworksData);
    await Thread.insertMany(threadData);
    console.log('Data inserted!');
    return 'ok';
  } catch (error) {
    console.error(error);
    return 'error';
  }
};

const deleteTestData = async () => {
  try {
    await Bead.deleteMany();
    await Beadwork.deleteMany();
    await Thread.deleteMany();
    console.log('Data cleaned!');
    return 'ok';
  } catch (error) {
    console.error(error);
    return 'error';
  }
};

const backupOriginalData = async () => {
  try {
    const originalBeadsData = await Bead.find();
    const originalBeadworksData = await Beadwork.find();
    const originalThreadsData = await Thread.find();
    console.log('Data backed up!');
    return {
      originalBeadsData,
      originalBeadworksData,
      originalThreadsData,
    };
  } catch (error) {
    console.error(error);
    return 'error';
  }
};

const restoreOriginalData = async backupData => {
  try {
    await Bead.insertMany(backupData.originalBeadsData);
    await Beadwork.insertMany(backupData.originalBeadworksData);
    await Thread.insertMany(backupData.originalThreadsData);
    console.log('Data restored!');
    return 'ok';
  } catch (error) {
    console.error(error);
    return 'error';
  }
};

module.exports = {
  createTestData,
  deleteTestData,
  backupOriginalData,
  restoreOriginalData,
};
