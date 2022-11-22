const User = require('../../models/User');

const getUserData = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      const error = new Error('No userId delivered!!');
      error.status = 400;
      throw error;
    }

    const user = await User.findById(userId)
      .populate({ path: 'myBeadworks', populate: { path: 'author' } })
      .populate({ path: 'sharedBeadworks', populate: { path: 'author' } });
    if (!user) {
      const error = new Error('Invalid userId!!');
      error.status = 400;
      throw error;
    }

    res.locals.data = user;

    next();
  } catch (error) {
    error.message = `Error in getUserData in userMiddlewares.js : ${error.message}`;

    next(error);
  }
};

const patchUserData = async () => {};

module.exports = { getUserData, patchUserData };
