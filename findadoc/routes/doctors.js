var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({contactPoints:['127.0.0.1']});

/* GET doctors listing. */
router.get('/', function(req, res, next) {
  if(req.query.state){
  	var query = "SELECT * FROM findadoc.doctors WHERE state = ?";
  	client.execute(query, [req.query.state], function(error, results){
  		if(error){
  			res.status(404).send({msg: error});
  		}else{
  			res.render('doctors',{
  				title: 'Browse Doctor :: findaDoc',
  				doctors: results.rows
  			});
  		}
  	});

  }else{
  	var query = "SELECT * FROM findadoc.doctors";
	client.execute(query, [], function(error, results){
		if(error){
			res.status(404).send({msg: error});
		}else{
			res.render('doctors', {
				title: 'Browse Doctor:: findaDoc',
				doctors: results.rows
			});
		}
	});//[] represents a condition (2nd parameter)	
  }
  
});

/*GET add doctor Page*/
router.get('/add', function(req, res, next){
	var query = "SELECT * FROM findadoc.categories";
	client.execute(query, [], function(error, results){
		if(error){
			res.status(404).send({msg: error});
		}else{
			res.render('add-doctor', {
				title: 'Add Doctors :: findaDoc',
				categories: results.rows
			});
		}
	});
	
});

/*GET details page*/
router.get('/details/:id', function(req, res, next){
	var id = req.params.id;
	var query = "SELECT * FROM findadoc.doctors WHERE id = ?";
	client.execute(query, [id], function(error, result){
		if(error){
			res.status(404).send({msg: error});
		}else{
			res.render('details', {
				title: 'Details::findaDoc',
				doctor: result.rows[0]
			});
		}
	});
});

/*List the doctors according to Category*/
router.get('/category/:name', function(req, res, next){
	var name = req.params.name;
	var query = "SELECT * FROM findadoc.doctors WHERE category = ?";
	client.execute(query, [name], function(error, results){
	if(error){
		res.status(404).send({msg: error});
	}else{
		res.render('doctors', {
			doctors: results.rows
		});
	}
});
});	

/*Post the Add doctor Form*/
router.post('/add', function(req, res, next){
	//Auto Generates the uuid
	var id = cassandra.types.uuid();
	//Get the form value
	var fullname = req.body.fullname;
	var category = req.body.category;
	var newpatients = req.body.newPatients;
	var graduationyear = req.body.graduationYear;
	var practicename = req.body.practiceName;
	var streetaddress = req.body.streetaddress;
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	var query = "INSERT INTO findadoc.doctors(id, fullname, category, newpatients, graduationyear, practicename, streetaddress, city, state, zip)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

	client.execute(query, [id, fullname, category, newpatients, graduationyear, practicename, streetaddress, city, state, zip], {prepare: true}, function(error, result){
		if(error){
			res.status(404).send({msg: error});
		}else{
			req.flash('success', 'New Doctor Added');
			res.location('/doctors');
			res.redirect('/doctors');
		}
	});
});

module.exports = router;
