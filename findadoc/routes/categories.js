var express = require('express'); 
var router = express.Router();
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({contactPoints: ['127.0.0.1']});

/* GET Category page. */
router.get('/add', function(req, res, next) {
  res.render('add-category', { title: 'Category::FindaDoc' });
});

/*Handles the Post Request*/
router.post('/add', function(req, res, next){
	var id = cassandra.types.uuid();
	//Get the Values of the form
	var name = req.body.name;

	var query = "INSERT INTO findadoc.categories(id, name)VALUES(?, ?)";
	client.execute(query, [id, name], {prepare: true}, function(error, result){
		if(error){
			res.status(404).send({msg: error});
		}else{
			req.flash('success', 'New Category Added');
			res.location('/');
			res.redirect('/');
		}
	});
});
module.exports = router;