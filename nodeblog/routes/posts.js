var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    var mimeType = file.mimetype;
    var extension = mimeType.split("/");
    if(extension[0] == 'image'){
    	console.log(extension[1]);
    	//Only Upload if the given file is image
    	cb(null, file.fieldname + Date.now() + '.' + extension[1]);	
    }else{
    	cb(new Error('Please Upload Image File'));
    }
    
  }
});
var upload = multer({ storage: storage });

router.get('/show/:id', function(req, res, next){
	var post = db.get('posts');
	post.findById(req.params.id, function(error, post){
		res.render('show', {
			title: req.params.title,
			post: post
		});
	});
});

router.get('/add', upload.single('mainImage'), function(req, res, next){
	var categories = db.get('categories');
	categories.find({},{}, function(error, categories){
		res.render('addposts', {
			title: 'Add Posts',
			categories: categories
		});	
	});
});


router.post('/add', function(req, res, next){
	// Get the form values
	var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();

	if(req.file){
		var mainImage = req.file;
		var mainImageName = req.file.originalname;
		var mainImageTempName = req.file.name;
		var mainImageMimeType = req.file.mimetype;
		var mainImageSize = req.file.size;
		var mainImageExtension = req.file.extension;
		var mainImagePath = req.file.path;
	}else{
		var mainImageName = 'noimage.png'
	}

	//Form Validation
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('body', 'Description is required').notEmpty();
	
	//check Errors
	var errors = req.validationErrors();
	if(errors){
		res.render('addposts', {
			errors: errors,
			title: title,
			body: body

		});
	}else{
		var posts = db.get('posts');

		//Submit to db
		posts.insert({
			title: title,
			body: body,
			category: category,
			date: date,
			author: author,
			mainImage: mainImageName
		}, function(error, post){
			if(error){
				throw error;
			}else{
				req.flash('success', 'New Post Added');
				res.location('/');
				res.redirect('/');
			}
		});
	}	
	
});

router.post('/addcomment', function(req, res, next){
	//Get the form values
	var name = req.body.name;
	var email = req.body.email;
	var body = req.body.body;
	var postid = req.body.postid;
	var commentDate = new Date();

	//Form Validation
	req.checkBody('name', 'Name is compulsory').notEmpty();
	req.checkBody('email', 'Email is compulsory').notEmpty();
	req.checkBody('email', 'Email Address is not Valid').isEmail();
	req.checkBody('body', 'Description is Required').notEmpty();

	//check Errors
	var errors = req.validationErrors();
	if(errors){
		var post = db.get('posts');
		post.findById(postid, function(error, post){
			res.render('show', {
				errors: errors,
				post: post
			});
		});
	}else{
		var comment = {name: name, email: email, body: body, commentDate: commentDate};
		var post = db.get('posts');

		//Submit to DB
		post.update({
			_id: postid
			},{
				$push:{
					comments: comment
				}
			},function(error, doc){
				if(error){
					throw error;
				}else{
					req.flash('success', 'Comments Published');
					res.location('/posts/show/'+ postid);
					res.redirect('/posts/show/'+ postid);
				}
			}
		);
	}
});

module.exports = router;