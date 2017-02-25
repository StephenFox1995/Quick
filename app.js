const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const user = require('./routes/user');
const business = require('./routes/business');
const product = require('./routes/product');
const order = require('./routes/order');
const prediction = require('./routes/prediction');
const auth = require('./routes/authenticate');
const views = require('./routes/views');
const config = require('./config/runConfig');
const assert = require('assert');

const app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* **********************
 *  ROUTES
 ***********************/
app.use('/', routes);
app.use('/views', views);
app.use('/authenticate', auth);
app.use('/user', user);
app.use('/business', business);
app.use('/product', product);
app.use('/order', order);
app.use('/prediction', prediction);


/**
 * Initializes the applications.
 * Initialization includes:
 *  - Locating the database.
 *  - Finding the token secret for the application.
 *
 *  Both of which values are stored as configurations.
 *  See runConfig.js for more details.
 **/
(function initializeApplication() {
  // Locate the database, otherwise return.
  config.setupDatabase(function(err) {
    assert.equal(null, err);
  });

  // Set the token secret, other wise return.
  if (!config.tokenSecret()) {
    return;
  }
})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
