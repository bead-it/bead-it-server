const Beadwork = require('../../models/Beadwork');

const getBeadworkData = async (req, res, next) => {
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

    const beadwork = await Beadwork.create({
      author: userId,
    });
    if (!beadwork) {
      throw new Error('Not created!!');
    }

    res.locals.data = beadwork;

    next();
  } catch (error) {
    error.message = `Error in postBeadworkData in beadworkMiddlewares.js : ${error.message}`;

    next(error);
  }
};

const patchBeadworkData = () => {};

module.exports = { getBeadworkData, postBeadworkData, patchBeadworkData };
