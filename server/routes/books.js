// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
    console.log("Adding books")
    res.render("books/details", { title: "Add Books", books: [] });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

  const { title, price, author, genre } = req.body;

  let toCreateBook = new book({
    Title: title,
    Price: price,
    Description: "",
    Author: author,
    Genre: genre
  });
  
  toCreateBook.save((error, createdBook) => {
    if ( error ) {
      console.log("Failed to save book!", error);
    }
  });

  res.redirect("/books");

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

  book.findById(req.params.id, (err, doc) => {

    if ( err ) {
      console.log("Failed to query book!", err);
      res.redirect("/books");
    }

    res.render("books/details", { title: "Book Details", books: doc });
  });

    
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

  book.findById(req.params.id, (err, doc) => {

    if ( err ) {
      console.log("Failed to query book to update!", err);
      res.redirect("/books");
    }

    doc.Title = req.body.title;
    doc.Price = req.body.price;
    doc.Author = req.body.author;
    doc.Genre = req.body.genre;

    doc.save((err, savedDoc) => {
      if ( err ) {
        console.log("Failed to update book!", err);
      }
      res.redirect("/books");
    });
  });

});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

  book.findById(req.params.id, (err, doc) => {

    if ( err ) {
      console.log("Failed to query book to delete!", err);
      res.redirect("/books");
    }


    doc.remove((err, savedDoc) => {
      if ( err ) {
        console.log("Failed to remove book!", err);
      }
      res.redirect("/books");
    });
  });

});


module.exports = router;
