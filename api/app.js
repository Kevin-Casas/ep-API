var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var carrerasRouter = require('./routes/carreras');
var aulasRouter = require('./routes/aulas');
var edificiosRouter = require('./routes/edificios');
var materiasRouter = require('./routes/materias');
var routes = require('./routes');
// Swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ep-API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3001"
      }
    ],
  },
  apis: ['./routes/*.js', './routes.js'],
};



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', routes);
app.use('/car', carrerasRouter);
app.use('/aul', aulasRouter);
app.use('/edi', edificiosRouter);
app.use('/mat', materiasRouter);
// Swagger
app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(swaggerSpec)));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
