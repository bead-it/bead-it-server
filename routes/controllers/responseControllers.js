const endOfGetReq = (req, res, next) => {
  try {
    const responseBody = {};

    responseBody.result = 'ok';
    responseBody.data = res.locals.data;

    res.status(200).json(responseBody);
  } catch (error) {
    error.message = `Error in endOfGetReq in responseControllers.js : ${error.message}`;

    next(error);
  }
};

const endOfPostReq = (req, res, next) => {
  try {
    const responseBody = {};

    responseBody.result = 'ok';
    responseBody.data = res.locals.data;

    res.status(201).json(responseBody);
  } catch (error) {
    error.message = `Error in endOfPostReq in responseControllers.js : ${error.message}`;

    next(error);
  }
};

const endOfPatchReq = (req, res) => {
  res.status(204).end();
};

module.exports = { endOfGetReq, endOfPostReq, endOfPatchReq };
