const Bead = require('../../models/Bead');
const Beadwork = require('../../models/Beadwork');

const getBeadData = async (req, res, next) => {
  try {
    const { beadworkId } = res.params;
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
    if (bead.beadwork !== beadworkId) {
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
    const { beadworkId } = res.params;
    if (!beadworkId) {
      const error = new Error('No beadworkId delivered!!');
      error.status = 400;
      throw error;
    }

    const beadwork = await Beadwork.findById(beadworkId).populate({
      path: 'bead',
      populate: {
        path: 'page',
      },
    });
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

const postBeadData = () => {};

const patchBeadData = () => {};

module.exports = { getBeadData, getAllBeadData, postBeadData, patchBeadData };
