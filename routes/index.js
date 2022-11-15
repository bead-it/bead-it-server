const express = require('express');

const baseRouter = express.Router();

const beadworkRouter = require('./beadworkRouter');
const beadRouter = require('./beadRouter');
const threadRouter = require('./threadRouter');

baseRouter.use(
  '/users/:userId/beadworks',
  (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        const error = new Error('No userId delivered!!');
        error.status = 400;
        throw error;
      }

      res.locals.userId = userId;

      next();
    } catch (error) {
      error.message = `Error in baseRouter for beadworkRouter in index.js : ${error.message}`;

      next(error);
    }
  },
  beadworkRouter,
);
baseRouter.use(
  '/users/:userId/beadworks/:beadworkId/beads',
  (req, res, next) => {
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

      res.locals.userId = userId;
      res.locals.beadworkId = beadworkId;

      next();
    } catch (error) {
      error.message = `Error in baseRouter for beadRouter in index.js : ${error.message}`;

      next(error);
    }
  },
  beadRouter,
);
baseRouter.use(
  '/users/:userId/beadworks/:beadworkId/threads',
  (req, res, next) => {
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

      res.locals.userId = userId;
      res.locals.beadworkId = beadworkId;

      next();
    } catch (error) {
      error.message = `Error in baseRouter for threadRouter in index.js : ${error.message}`;

      next(error);
    }
  },
  threadRouter,
);

export default baseRouter;
