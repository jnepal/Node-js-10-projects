'use strict';

var Book = require('../models/bookModel');


module.exports = function (router) {
    router.get('/', function (req, res) {
    	Book.find({}, function(error, books){
    		if(error){
    			console.log(error);
    		}
            books.forEach(function(book){
                book.truncateText = book.truncateText(50);
            });
    		var model = {
    			books: books
    		};
    		res.render('index', model);
    	});
        
    });
};
