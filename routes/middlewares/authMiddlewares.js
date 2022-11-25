const { GoogleAuthProvider, signInWithCredential } = require('firebase/auth');
const jwt = require('jsonwebtoken');
const { authentication } = require('../../configs/firebase');
const User = require('../../models/User');

const auth = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      const error = new Error('No userId delivered!!');
      error.status = 400;
      throw error;
    }

    const user = await User.findById(userId).exec();
    if (!user) {
      const error = new Error('Invalid userId delivered!!');
      error.status = 400;
      throw error;
    }

    const { authorization } = req.headers;
    if (!authorization) {
      const error = new Error('No token delivered!!');
      error.status = 400;
      throw error;
    }

    const token = authorization.split(' ')[1];
    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      if (user.email !== verified.email) {
        throw new Error('Email mismatched!!');
      }
    } catch (error) {
      error.message = `Invalid token delivered!! : ${error.message}`;
      error.status = 401;
      throw error;
    }

    next();
  } catch (error) {
    error.message = `Error in auth in authMiddlewares.js : ${error.message}`;

    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { accessToken, idToken } = req.body;
    if (!(accessToken && idToken)) {
      const error = new Error('Not all data required delivered!!');
      error.status = 400;
      throw error;
    }

    const credential = GoogleAuthProvider.credential(idToken, accessToken);

    const credentialResult = await signInWithCredential(
      authentication,
      credential,
    );

    const { user: credentialUser } = credentialResult;
    const { displayName, email, photoURL, uid } = credentialUser;

    const payload = {
      username: displayName,
      email,
      profile: photoURL,
      googleId: uid,
    };

    let user = await User.findOne({ email }).exec();
    if (!user) {
      user = await User.create(payload);
    }
    const { _id: userId } = user;

    payload.id = userId;

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '8h',
    });

    res.locals.data = { beaditToken: token };

    next();
  } catch (error) {
    error.message = `Error in login in authMiddlewares.js : ${error.message}`;

    throw error;
  }
};

module.exports = { auth, login };
