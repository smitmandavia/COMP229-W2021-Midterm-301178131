// moddules for node and express
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

// import "mongoose" - required for DB Access
let mongoose = require('mongoose');
// URI
let DB = require('./db');

mongoose.connect(process.env.URI || DB.URI, {useNewUrlParser: true, useUnifiedTopology: true});

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', ()=> {
  console.log("Connected to MongoDB...");

  // const BookModel = require("../models/books");
  // // Mock data initially
  // [
  //   new BookModel({
  //     "Title": "Eloquent JavaScript, Second Edition",
  //     "Author": "Marijn Haverbeke",
  //     "Genre": "Software",
  //     "Description": "JavaScript lies at the heart of almost every modern web application, from social apps to the newest browser-based games. Though simple for beginners to pick up and play with, JavaScript is a flexible, complex language that you can use to build full-scale applications.",
  //     "Price": 560
  //   }),
  //   new BookModel({
  //     "Title": "Learning JavaScript Design Patterns",
  //     "Author": "Addy Osmani",
  //     "Genre": "Software",
  //     "Description": "With Learning JavaScript Design Patterns, you'll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language. If you want to keep your code efficient, more manageable, and up-to-date with the latest best practices, this book is for you.",
  //     "Price": 350
  //   }),
  //   new BookModel({
  //     "Title": "Speaking JavaScript",
  //     "Author": "Axel Rauschmayer",
  //     "Genre": "Software",
  //     "Description": "Like it or not, JavaScript is everywhere these days-from browser to server to mobile-and now you, too, need to learn the language or dive deeper than you have. This concise book guides you into and through JavaScript, written by a veteran programmer who once found himself in the same position.",
  //     "Price": 200
  //   }),
  // ].map((bookModel, i) => {
  //   bookModel.save(function(err, bookM) {
  //     console.log("Failed to save: ", err, bookM);
  //   })
  // })
});


// define routers
let index = require('../routes/index'); // top level routes
let books = require('../routes/books'); // routes for books

let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /client
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../client')));


// route redirects
app.use('/', index);
app.use('/books', books);


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
