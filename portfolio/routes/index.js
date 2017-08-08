var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'portfolio-node_db'
});

connection.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
	connection.query('SELECT * FROM projects', function(error, rows, fields){
		if(error){
			throw error;
		}
		res.render('index', {
			rows: rows
		});
	});
  
});

module.exports = router;
