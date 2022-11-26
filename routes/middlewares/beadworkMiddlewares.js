const Beadwork = require('../../models/Beadwork');
const User = require('../../models/User');
const Bead = require('../../models/Bead');
const Thread = require('../../models/Thread');

const getBeadworkData = async (req, res, next) => {
  try {
    const { beadworkId } = req.params;
    if (!beadworkId) {
      const error = new Error('No beadworkId delivered!!');
      error.status = 400;
      throw error;
    }

    const beadwork = await Beadwork.findById(beadworkId)
      .populate('author')
      .exec();
    if (!beadwork) {
      const error = new Error('Invalid beadworkId!!');
      error.status = 400;
      throw error;
    }

    res.locals.data = beadwork;

    next();
  } catch (error) {
    error.message = `Error in getBeadworkData in beadworkMiddlewares.js : ${error.message}`;

    next(error);
  }
};

const postBeadworkData = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      const error = new Error('No userId delivered!!');
      error.status = 400;
      throw error;
    }

    const user = await User.findById(userId).exec();
    if (!user) {
      const error = new Error('Invalid userId!!');
      error.status = 400;
      throw error;
    }

    const beadwork = await Beadwork.create({
      author: userId,
    });
    if (!beadwork) {
      throw new Error('Not created!!');
    }

    const { _id: beadworkId } = beadwork;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { myBeadworks: beadworkId } },
      { returnDocument: 'after' },
    ).exec();
    if (!updatedUser) {
      throw new Error('Not updated!!');
    }

    res.locals.data = beadwork;

    next();
  } catch (error) {
    error.message = `Error in postBeadworkData in beadworkMiddlewares.js : ${error.message}`;

    next(error);
  }
};

const patchBeadworkData = async (req, res, next) => {
  try {
    const { userId, beadworkId } = req.params;
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

    const { title, description } = req.body;
    if (!title && !description) {
      const error = new Error('No data delivered!!');
      error.status = 400;
      throw error;
    }

    const updateTarget = {};
    if (title) {
      updateTarget.title = title;
    }
    if (description) {
      updateTarget.description = description;
    }

    const user = await User.findById(userId).exec();
    const beadwork = await Beadwork.findById(beadworkId).exec();
    if (
      !user ||
      !beadwork ||
      !user.myBeadworks.map(objId => objId.toString()).includes(beadworkId) ||
      beadwork.author.toString() !== userId
    ) {
      const error = new Error('UserId is not matched with beadworkId!!');
      error.status = 400;
      throw error;
    }

    const updatedBeadwork = await Beadwork.findByIdAndUpdate(
      beadworkId,
      updateTarget,
      { returnDocument: 'after' },
    ).exec();
    if (!updatedBeadwork) {
      throw new Error('Not updated!!');
    }

    next();
  } catch (error) {
    error.message = `Error in patchBeadworkData in beadworkMiddlewares.js : ${error.message}`;

    next(error);
  }
};

const copyBeadworkContents = async (req, res, next) => {
  try {
    const { beadworkId } = req.params;
    const prevBeadwork = await Beadwork.findById(beadworkId)
      .populate('threads')
      .exec();
    if (!prevBeadwork) {
      const error = new Error('Invalid beadworkId!!');
      error.status = 400;
      throw error;
    }

    const allBeadsSet = new Set(
      prevBeadwork.beads.map(objId => objId.toString()),
    );
    const { selectedBeads } = req.body;
    const selectedBeadsSet = new Set(selectedBeads);

    if (!selectedBeads.every(beadId => allBeadsSet.has(beadId))) {
      const error = new Error(
        'Selected beads are not matched with with beadworkId!!',
      );
      error.status = 400;
      throw error;
    }

    const newBeadwork = res.locals.data;
    const { _id: newBeadworkId } = newBeadwork;

    const originalBeads = await Bead.find({ _id: selectedBeads }).lean();
    const newBeadsData = originalBeads.map(bead => {
      return {
        page: bead.page,
        beadwork: newBeadworkId,
      };
    });
    const newBeads = await Bead.create(newBeadsData);

    const beadsMapping = {};

    newBeads.forEach((bead, i) => {
      const { _id: newBeadId } = bead;
      beadsMapping[selectedBeads[i]] = newBeadId;
    });

    const newThreadsData = prevBeadwork.threads
      .filter(thread => {
        return (
          selectedBeadsSet.has(thread.source.toString()) &&
          selectedBeadsSet.has(thread.target.toString())
        );
      })
      .map(thread => {
        return {
          source: beadsMapping[thread.source.toString()],
          target: beadsMapping[thread.target.toString()],
          content: thread.content,
          beadwork: newBeadworkId,
        };
      });
    const newThreads = await Thread.create(newThreadsData);

    newBeadwork.beads = newBeads.map(bead => {
      const { _id: beadId } = bead;
      return beadId;
    });

    newBeadwork.threads = newThreads.map(thread => {
      const { _id: threadId } = thread;
      return threadId;
    });

    await newBeadwork.save();

    next();
  } catch (error) {
    error.message = `Error in copyBeadworkContents in beadworkMiddlewares.js : ${error.message}`;

    next(error);
  }
};

module.exports = {
  getBeadworkData,
  postBeadworkData,
  patchBeadworkData,
  copyBeadworkContents,
};
