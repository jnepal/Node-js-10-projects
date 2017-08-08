'use strict'

var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');

module.exports = function(router){
	router.get('/', function(req, res, next){
		res.render('manage/index');
	});
	
	router.get('/books', function(req, res, next){
		Book.find({}, function(error, books){
			if(error){
				console.log(error);
			}

			var model = {
				books: books
			};
			res.render('manage/books/index', model);
		});
	});
	router.get('/categories', function(req, res, next){
		Category.find({}, function(error, categories){
			if(error){
				console.log(error);
			}

			var model = {
				categories: categories
			};

			res.render('manage/categories/index', model);
		});
		
	});
	router.get('/books/add', function(req, res, next){
		Category.find({}, function(error, categories){
			if(error){
				console.log(error);
			}

			var model = {
				categories: categories
			};

			res.render('manage/books/add', model);
		});
	});
	router.post('/books/add', function(req, res, next){
		//Get the Posted Variables
		var title = req.body.title && req.body.title.trim();
		var category = req.body.category && req.body.category.trim();
		var author = req.body.author && req.body.author.trim();
		var publisher = req.body.publisher && req.body.publisher.trim();
		var price = req.body.price && req.body.price.trim();
		var description = req.body.description && req.body.description.trim();
		var cover = req.body.cover && req.body.cover.trim();

		//Form Validation
		if(title == '' ||price == ''){
			req.flash('error', "Please Fill the Required fields");
			res.location('/manage/books/add');
			res.redirect('/manage/books/add');
		}
		//isNaN means is not a number
		if(isNaN(price)){
			req.flash('error', 'Price Must be a Number');
			res.location('/manage/books/add');
			res.redirect('/manage/books/add');
		} 

		var newBook = new Book({
			title: title,
			category: category,
			description: description,
			author: author,
			publisher: publisher,
			cover: cover,
			price: price
		});

		newBook.save(function(error){
			if(error){
				console.log(error);
			}
			req.flash('success', "New Book Added");
			res.location('/manage/books');
			res.redirect('/manage/books');
		});
	});
	
	//Display Edit Form
	router.get('/books/edit/:id', function(req, res, next){
		Category.find({}, function(error, categories){
			Book.findOne({_id: req.params.id}, function(error, book){
				if(error){
					console.log(error);
				}

				var model = {
					book: book,
					categories: categories
				};
				res.render('manage/books/edit', model);
			});
		});
	});

	//Handles post request of Edit Form
	router.post('/books/edit/:id', function(req, res, next){
		var id = req.params.id;
		//Get the Posted Variable
		var title = req.body.title && req.body.title.trim();
		var category = req.body.category && req.body.category.trim();
		var author = req.body.author && req.body.author.trim();
		var publisher = req.body.publisher && req.body.publisher.trim();
		var price = req.body.price && req.body.price.trim();
		var description = req.body.description && req.body.description.trim();
		var cover = req.body.cover && req.body.cover.trim();

		Book.update({_id: id}, {
			title: title,
			category: category,
			author: author,
			publisher: publisher,
			price: price,
			description: description,
			cover: cover
		}, function(error){
			if(error){
				console.log(error);
			}

			req.flash('success', 'Book Updated');
			res.location('/manage/books/');
			res.redirect('/manage/books');
		});
	});

	//Handles the Delete Route (couldnot get it working via ajax may be due to csrf isssue)
	// router.delete('/books/delete/:id', function(req, res){
	// 	var id = req.params.id;
	// 	Book.remove({_id: id}, function(error){
	// 		if(error){
	// 			console.log(error);
	// 		}
	// 		req.flash('success', 'Book Deleted');
	// 		res.location('/manage/books');
	// 		res.redirect('/manage/books');
	// 	});
	// });

	//Handles the Delete Route 
	router.get('/books/delete/:id', function(req, res){
		var id = req.params.id;
		Book.remove({_id: id}, function(error){
			if(error){
				console.log(error);
			}
			req.flash('success', 'Book Deleted');
			res.location('/manage/books');
			res.redirect('/manage/books');
		});
	});

	//Get the Category add form 
	router.get('/categories/add', function(req, res, next){
		res.render('manage/categories/add');
	});

	//Handles the post request of Add new Category
	router.post('/categories/add', function(req, res, next){
		//Get the Posted Value
		var name = req.body.name && req.body.name.trim();
		if(name === ''){
			req.flash('error', 'Please fill out the required fields');
			res.location('/manage/categories');
			res.redirect('/manage/categories');
		}

		var newCategory = new Category({
			name: name
		});

		newCategory.save(function(error){
			if(error){
				console.log(error);
			}

			req.flash('success', 'New Category Added');
			res.location('/manage/categories');
			res.redirect('/manage/categories');
		});

		//Display Edit form of category
		router.get('/categories/edit/:id', function(req, res, next){
			var id = req.params.id;

			Category.findOne({_id: id}, function(error, category){
				if(error){
					console.log(error);
				}

				var model = {
					category: category
				};
				res.render('manage/categories/edit', model);
			});
		});

		//Handles the post request of edit category
		router.post('/categories/edit/:id', function(req, res, next){
			var id = req.params.id;
			//Get the Posted Value
			var name = req.body.name && req.body.name.trim();

			Category.update({_id: id}, {
				name: name
			}, function(error){
				if(error){
					console.log('Category Update Error', error);
				}

				req.flash('success', 'Category updated');
				res.location('/manage/categories');
				res.redirect('/manage/categories');
			});
		});

		//Handles the Delete Request
		router.get('/categories/delete/:id', function(req, res, next){
			var id = req.params.id;

			Category.remove({_id: id}, function(error){
				if(error){
					console.log('Category Delete Error', error);
				}

				req.flash('success', 'Category Deleted');
				res.location('/manage/categories');
				res.redirect('/manage/categories');
			});
		});
	});

};