var express = require('express');
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var router = express.Router();

/* GET home page Blog Post. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({},{}, function(error, posts){
  	res.render('index', {
  		"posts": posts
  	})
  });
});

module.exports = router;
