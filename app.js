const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const noteRoutes = require('./api/routes/notes');
const authorRoutes = require('./api/routes/authors');
const userRoutes = require('./api/routes/user');


mongoose.connect('mongodb://admin:'+ process.env.MONGO_ATLAS_PW +'@projectnode-shard-00-00-kgrep.mongodb.net:27017,projectnode-shard-00-01-kgrep.mongodb.net:27017,projectnode-shard-00-02-kgrep.mongodb.net:27017/test?ssl=true&replicaSet=ProjectNode-shard-0&authSource=admin&retryWrites=true', {
  
  useNewUrlParser: true

});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CROS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
});

// Routes which should handle requests
app.use('/notes', noteRoutes);
app.use('/authors', authorRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app; 