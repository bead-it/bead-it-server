const auth = (req, res, next) => {
  next();
};

const auth2 = () => {};

module.exports = { auth, auth2 };
