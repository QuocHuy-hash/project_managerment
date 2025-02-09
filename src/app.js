var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const compression = require('compression');
// const swaggerDocs = require('./utils/swagger');
const cors = require('cors');
require('dotenv').config();
var app = express();
const logs = require('./loggers/logs');

// view engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compression());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var corsOptions = {
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'http:127.0.0.1:3055',
    'https://shop-ecommerce.click/', 'http://localhost:9000', 'http://localhost:5173'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
// Swagger setup
// swaggerDocs.swaggerDocs(app, 3055);
//router

app.use('/', require('./routes/index'));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function (error, req, res, next) {
  next(createError(404));
  console.log(error.message)
  const strError = JSON.stringify(error.message);
  const body = JSON.stringify(req.body);
  const errorMessage = `${req.method} ${req.path} - ${strError} - Body::${body}`;
  logs.error(errorMessage, req.body);
});

// init handle exceptions
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404
  next(error);
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Service Error'
  })
})

module.exports = app;
