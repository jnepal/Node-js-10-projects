'use strict'
var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');

module.exports = function(router){
	router.get('/', function(req, res, next){
		res.render('index');
	});

	router.get('/details/:id', function(req, res, next){
		Book.findOne({_id: req.params.id}, function(error, book){
			if(error){
				console.log(error);
			}

			var model = {
				book: book
			};

			res.render('books/details', model);
		});

	});
};