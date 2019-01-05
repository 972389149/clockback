const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users.js');
const administratorRouter = require('./routes/administrator.js');
const departmentRouter = require('./routes/department.js');
const userRouter = require('./routes/users.js');
const initiativeMsgRouter = require('./routes/initiativeMsg.js');
const passivityMsgRouter = require('./routes/passivityMsg.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// 添加json解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//加载路由
app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/administrator', administratorRouter);
app.use('/department', departmentRouter);
app.use('/user', userRouter);
app.use('/initiativeMsg', initiativeMsgRouter);
app.use('/passivityMsg', passivityMsgRouter);

//启动MongoDB服务器
const mongoose = require('./config/mongoose.js');
const db = mongoose();

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
