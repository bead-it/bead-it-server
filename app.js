require('dotenv').config();
const express = require('express');
const logger = require('morgan');

const baseRouter = require('./routes/index');

const app = express();

require('./configs/dbConfig')();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/', baseRouter);

app.use((req, res, next) => {
  const error = new Error('Page Not Found');
  error.status = 404;
  next(error);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const responseBody = {
    result: 'error',
    code: err.status || 500,
    message: `Error occured in backend server : ${
      req.app.get('env') === 'development' ? err.message : ''
    }`,
  };

  console.error(err);
  res.json(responseBody);
});

module.exports = app;
