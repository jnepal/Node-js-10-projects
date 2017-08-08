var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

//User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String,
		required: true,
		bcrypt: true
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	 profileImage: {
	 	type: String
	 }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(user, callback){
	bcrypt.hash(user.password, null, null, function(error, hash){
		if(error){
			throw error;
		}
		//Set hash Password
		user.password = hash;
	});
	user.save(callback);
};

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
	
};

module.exports.getUserById = function(id, callback){
	User.findById(id, callback) // findById is function of Mongo Db
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(error, isMatch){
		if(error){
			return callback(error);
		}
		callback(null, isMatch);
	});
};