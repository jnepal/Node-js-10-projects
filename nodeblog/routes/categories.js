var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

//Get the Index Page
router.get('/add', function(req, res, next){
	res.render('addcategories', {title : "Add Category"});
});

router.get('/show/:category', function(req, res, next){
	var db = req.db;
	var posts = db.get('posts');

	posts.find({category: req.params.category},{}, function(error, posts){
		res.render('index', {
			title: req.params.category,
			posts: posts
		});
	});
});

//Post Request
router.post('/add', function(req, res, next){
	//Get Form Variables
	var title = req.body.title;

	//Form Validation
	req.checkBody('title', 'Title field is Compulsory').notEmpty();

	//Check Errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addcategories', {
			errors: errors,
			title: title,
		});
	}else{
		var categories = db.get('categories');

		//Submit To db
		categories.insert({
			title: title
		}, function(error, category){
			if(error){
				res.send('There was an issue Submitting the Category');
			}else{
				req.flash('success', 'Category Submitted');
				res.location('/');
				res.redirect('/');
			}

		});
	}

});

module.exports = router;