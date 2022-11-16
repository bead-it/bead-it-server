const Thread = require('../../models/Thread');
const Beadwork = require('../../models/Beadwork');

const getThreadData = async (req, res, next) => {
  try {
    const { beadworkId } = res.params;
    if (!beadworkId) {
      const error = new Error('No beadworkId delivered!!');
      error.status = 400;
      throw error;
    }

    const { threadId } = req.params;
    if (!threadId) {
      const error = new Error('No threadId delivered!!');
      error.status = 400;
      throw error;
    }

    const thread = await Thread.findById(threadId);
    if (!thread) {
      const error = new Error('Invalid threadId!!');
      error.status = 400;
      throw error;
    }
    if (thread.beadwork !== beadworkId) {
      const error = new Error('BeadworkId is not matched with threadId!!');
      error.status = 400;
      throw error;
    }

    res.locals.data = thread;

    next();
  } catch (error) {
    error.message = `Error in getThreadData in threadMiddlewares.js : ${error.message}`;

    next(error);
  }
};

const getAllThreadData = async (req, res, next) => {
  try {
    const { beadworkId } = res.params;
    if (!beadworkId) {
      const error = new Error('No beadworkId delivered!!');
      error.status = 400;
      throw error;
    }

    const beadwork = await Beadwork.findById(beadworkId)
      .populate('threads')
      .exec();
    if (!beadwork) {
      const error = new Error('Invalid beadworkId!!');
      error.status = 400;
      throw error;
    }

    res.locals.data = beadwork.threads;

    next();
  } catch (error) {
    error.message = `Error in getAllThreadData in threadMiddlewares.js : ${error.message}`;

    next(error);
  }
};

const postThreadData = async (req, res, next) => {
  try {
    const { beadworkId } = req.params;
    if (!beadworkId) {
      const error = new Error('No beadworkId delivered!!');
      error.status = 400;
      throw error;
    }

    const { source, target } = req.body;
    if (!(source && target)) {
      const error = new Error('Not all data required delivered!!');
      error.status = 400;
      throw error;
    }

    const thread = await Thread.create({
      source,
      target,
      beadwork: beadworkId,
    });
    if (!thread) {
      throw new Error('Not created!!');
    }

    const { _id: threadId } = thread;
    const beadwork = await Beadwork.findByIdAndUpdate(
      beadworkId,
      { $push: { threads: threadId } },
      { returnDocument: 'after' },
    ).exec();
    if (!beadwork) {
      throw new Error('Not updated!!');
    }

    res.locals.data = thread;

    next();
  } catch (error) {
    error.message = `Error in postThreadData in threadMiddlewares.js : ${error.message}`;

    next(error);
  }
};

const patchThreadData = () => {};

module.exports = {
  getThreadData,
  getAllThreadData,
  postThreadData,
  patchThreadData,
};
