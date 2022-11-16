const User = require('../models/User');
const Bead = require('../models/Bead');
const Beadwork = require('../models/Beadwork');
const Thread = require('../models/Thread');
const Page = require('../models/Page');

const usersData = require('./usermockdata');
const beadsData = require('./beadsmockdata');
const beadworksData = require('./beadworksmockdata');
const threadsData = require('./threadsmockdata');
const pagesData = require('./pagemockdata');

const createTestData = async () => {
  try {
    await User.insertMany(usersData);
    await Bead.insertMany(beadsData);
    await Beadwork.insertMany(beadworksData);
    await Thread.insertMany(threadsData);
    await Page.insertMany(pagesData);
    console.log('Data inserted!');
    return 'ok';
  } catch (error) {
    console.error(error);
    return 'error';
  }
};

const deleteTestData = async () => {
  try {
    await User.deleteMany();
    await Bead.deleteMany();
    await Beadwork.deleteMany();
    await Thread.deleteMany();
    await Page.deleteMany();
    console.log('Data cleaned!');
    return 'ok';
  } catch (error) {
    console.error(error);
    return 'error';
  }
};

const backupOriginalData = async () => {
  try {
    const originalUsersData = await User.find();
    const originalBeadsData = await Bead.find();
    const originalBeadworksData = await Beadwork.find();
    const originalThreadsData = await Thread.find();
    const originalPagesData = await Page.find();
    console.log('Data backed up!');
    return {
      originalUsersData,
      originalBeadsData,
      originalBeadworksData,
      originalThreadsData,
      originalPagesData,
    };
  } catch (error) {
    console.error(error);
    return 'error';
  }
};

const restoreOriginalData = async backupData => {
  try {
    await User.insertMany(backupData.originalUsersData);
    await Bead.insertMany(backupData.originalBeadsData);
    await Beadwork.insertMany(backupData.originalBeadworksData);
    await Thread.insertMany(backupData.originalThreadsData);
    await Page.insertMany(backupData.originalPagesData);
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
