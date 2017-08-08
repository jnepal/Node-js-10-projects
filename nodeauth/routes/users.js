var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    var mimeType = file.mimetype;
    var extension = mimeType.split("/");
    if(extension[0] == 'image'){
    	//Only Upload if the given file is image
    	cb(null, file.fieldname + Date.now() + '.' + extension[1]);	
    }else{
    	cb(new Error('Please Upload Image File'));
    }
    
  }
});
var upload = multer({ storage: storage });


//Model
var User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next){
	res.render('register', {'title': 'Register'});
});

router.get('/login', function(req, res, next){
	res.render('login', {'title': 'Login'})
});

router.get('/logout', function(req, res, next){
	req.logout();
	req.flash('success', 'You have logged out');
	res.redirect('/users/login');
});

router.post('/register', upload.single('profileImage'), function(req, res, next){
	

	//Get Form Values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var confirmPassword = req.body.confirmPassword;
	//Check for image field
   if(req.file){
	   	console.log('Uploading File...');
	   	var profileImageName = req.file.originalname;
	   	var profileImageTempName = req.file.name;
	   	var profileImageMimeType = req.file.mimetype;
	   	var profileImagePath = req.file.path;
	 	var profileImageExtension = req.fileextension;
		var profileImageSize = req.file.size;

   }else{
   		//Set a Default Image
   		var profileImageName = 'noImage.png'; 
   }
		


	//Form Validation
	req.checkBody('name', 'Name is Compulsory').notEmpty();
	req.checkBody('email', 'Email is Compulsory').notEmpty();
	req.checkBody('email', 'Email id is not valid').isEmail();
	req.checkBody('username', 'Username is compulsory').notEmpty();
	req.checkBody('password', 'Password is Compulsory').notEmpty();

	//Check whether the password and confirm password match or not
	req.checkBody('confirmPassword', 'Password donot match').equals(req.body.password);

	//check for errors
	var errors = req.validationErrors();
	if(errors){
		res.render('register', {
			errors: errors,
			name: name,
			email: email,
			username: username
		});
	}else{
		var user = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profileImage: profileImageName
		});
		//Create User
		User.createUser(user, function(error, user){
			if(errors){
				throw error;
			}
			console.log(user);
		});
		//Success Message
		req.flash('success', 'Registration Successfully.Please Login');

		res.location('/');
		res.redirect('/');

	}
});

//serizlize and deserialize are used for session for users
passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.getUserById(id, function(error, user){
		done(error, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done){
		User.getUserByUsername(username, function(error, user){
			if(error){
				throw error;
			}
			if(!user){
				console.log('Unknown User');
				return done(null, false, {message: 'Unknown User'})
			}

			User.comparePassword(password, user.password, function(error, isMatch){
				if(error){
					throw error;
				}
				if(isMatch){
					return done(null, user);
				}else{
					console.log('Invalid Password');
					return done(null, false, {message: 'Invalid Password'});
				}
			});	
	});
}));

router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid Username or Password'}), function(req, res){
	console.log('Authentication Successful');
	req.flash('success', 'You have successfully logged in');
	res.redirect('/');
});



module.exports = router;
