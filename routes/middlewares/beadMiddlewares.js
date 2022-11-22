const Bead = require('../../models/Bead');
const Beadwork = require('../../models/Beadwork');
const Page = require('../../models/Page');
const User = require('../../models/User');

const getBeadData = async (req, res, next) => {
  try {
    const { beadworkId } = req.params;
    if (!beadworkId) {
      const error = new Error('No beadworkId delivered!!');
      error.status = 400;
      throw error;
    }

    const { beadId } = req.params;
    if (!beadId) {
      const error = new Error('No beadId delivered!!');
      error.status = 400;
      throw error;
    }

    const bead = await Bead.findById(beadId).populate('page');
    if (!bead) {
      const error = new Error('Invalid beadId!!');
      error.status = 400;
      throw error;
    }
    if (bead.beadwork.toString() !== beadworkId) {
      const error = new Error('BeadworkId is not matched with beadId!!');
      error.status = 400;
      throw error;
    }

    res.locals.data = bead;

    next();
  } catch (error) {
    error.message = `Error in getBeadData in beadMiddlewares.js : ${error.message}`;

    next(error);
  }
};

const getAllBeadData = async (req, res, next) => {
  try {
    const { beadworkId } = req.params;
    if (!beadworkId) {
      const error = new Error('No beadworkId delivered!!');
      error.status = 400;
      throw error;
    }

    const beadwork = await Beadwork.findById(beadworkId)
      .populate({
        path: 'beads',
        populate: {
          path: 'page',
        },
      })
      .exec();
    if (!beadwork) {
      const error = new Error('Invalid beadworkId!!');
      error.status = 400;
      throw error;
    }

    res.locals.data = beadwork.beads;

    next();
  } catch (error) {
    error.message = `Error in getAllBeadData in beadMiddlewares.js : ${error.message}`;

    next(error);
  }
};

const postBeadData = async (req, res, next) => {
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

    const { domain, url, title, keywords } = req.body;
    if (!(domain && url && title && keywords)) {
      const error = new Error('Not all data required delivered!!');
      error.status = 400;
      throw error;
    }

    let page = await Page.findOneAndUpdate(
      { domain, url },
      { title, keywords },
      { returnDocument: 'after' },
    );
    if (!page) {
      page = await Page.create({ domain, url, title, keywords });
    }

    const bead = await Bead.create({ page, beadwork: beadworkId });
    if (!(page && bead)) {
      throw new Error('Not created!!');
    }

    const { _id: beadId } = bead;
    const updatedBeadwork = await Beadwork.findByIdAndUpdate(
      beadworkId,
      { $push: { beads: beadId } },
      { returnDocument: 'after' },
    ).exec();
    if (!updatedBeadwork) {
      throw new Error('Not updated!!');
    }

    bead.populate('page');

    res.locals.data = bead;

    next();
  } catch (error) {
    error.message = `Error in postBeadData in beadMiddlewares.js : ${error.message}`;

    next(error);
  }
};

const patchBeadData = async (req, res, next) => {
  try {
    const { userId, beadworkId, beadId } = req.params;
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
    if (!beadId) {
      const error = new Error('No beadId delivered!!');
      error.status = 400;
      throw error;
    }

    const { tags } = req.body;
    if (!tags) {
      const error = new Error('No data delivered!!');
      error.status = 400;
      throw error;
    }

    const user = await User.findById(userId).exec();
    const beadwork = await Beadwork.findById(beadworkId).exec();
    const bead = await Bead.findById(beadId).exec();
    if (
      !(user && beadwork && bead) ||
      !user.myBeadworks.map(objId => objId.toString()).includes(beadworkId) ||
      beadwork.author.toString() !== userId ||
      !beadwork.beads.map(objId => objId.toString()).includes(beadId) ||
      bead.beadwork.toString() !== beadworkId
    ) {
      const error = new Error(
        'UserId, beadworkId, and beadId are not matched!!',
      );
      error.status = 400;
      throw error;
    }

    const updatedBead = await Bead.findByIdAndUpdate(
      beadId,
      { tags },
      { returnDocument: 'after' },
    ).exec();
    if (!updatedBead) {
      throw new Error('Not updated!!');
    }

    next();
  } catch (error) {
    error.message = `Error in patchBeadData in beadMiddlewares.js : ${error.message}`;

    next(error);
  }
};

module.exports = { getBeadData, getAllBeadData, postBeadData, patchBeadData };
