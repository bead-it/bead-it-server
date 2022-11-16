const Thread = require('../../models/Thread');
const Beadwork = require('../../models/Beadwork');
const User = require('../../models/User');

const getThreadData = async (req, res, next) => {
  try {
    const { beadworkId } = req.params;
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
    if (thread.beadwork.toString() !== beadworkId) {
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
    const { beadworkId } = req.params;
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

    const beadwork = await Beadwork.findById(beadworkId).exec();
    if (!beadwork) {
      const error = new Error('Invalid beadworkId!!');
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
    const updatedBeadwork = await Beadwork.findByIdAndUpdate(
      beadworkId,
      { $push: { threads: threadId } },
      { returnDocument: 'after' },
    ).exec();
    if (!updatedBeadwork) {
      throw new Error('Not updated!!');
    }

    res.locals.data = thread;

    next();
  } catch (error) {
    error.message = `Error in postThreadData in threadMiddlewares.js : ${error.message}`;

    next(error);
  }
};

const patchThreadData = async (req, res, next) => {
  try {
    const { userId, beadworkId, threadId } = req.params;
    if (!userId) {
      const error = new Error('No userId delivered!!');
      error.status = 400;
      throw error;
    }
    if (!beadworkId) {
      const error = new Error('No beadworkId delivered!!');
      error.status = 400;
      throw error;
    }
    if (!threadId) {
      const error = new Error('No threadId delivered!!');
      error.status = 400;
      throw error;
    }

    const { source, target, contents } = req.body;
    if (!source && !target && !contents) {
      const error = new Error('No data delivered!!');
      error.status = 400;
      throw error;
    }

    const updateTarget = {};
    if (source) {
      updateTarget.source = source;
    }
    if (target) {
      updateTarget.target = target;
    }
    if (contents) {
      updateTarget.contents = contents;
    }

    const user = await User.findById(userId).exec();
    const beadwork = await Beadwork.findById(beadworkId).exec();
    const thread = await Thread.findById(threadId).exec();
    if (
      !(user && beadwork && thread) ||
      !user.myBeadworks.map(objId => objId.toString()).includes(beadworkId) ||
      beadwork.author.toString() !== userId ||
      !beadwork.threads.map(objId => objId.toString()).includes(threadId) ||
      thread.beadwork.toString() !== beadworkId
    ) {
      const error = new Error(
        'UserId, beadworkId, and threadId are not matched!!',
      );
      error.status = 400;
      throw error;
    }

    const updatedThread = await Thread.findByIdAndUpdate(
      threadId,
      updateTarget,
      { returnDocument: 'after' },
    ).exec();
    if (!updatedThread) {
      throw new Error('Not updated!!');
    }

    next();
  } catch (error) {
    error.message = `Error in patchThreadData in threadMiddlewares.js : ${error.message}`;

    next(error);
  }
};

module.exports = {
  getThreadData,
  getAllThreadData,
  postThreadData,
  patchThreadData,
};
