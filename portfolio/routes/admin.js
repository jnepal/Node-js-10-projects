var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* Connect the Database*/
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'portfolio-node_db' 
});

connection.connect();
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    var mimeType = file.mimetype;
    var extension = mimeType.split("/");
    if(extension[0] == 'image'){
      //Only Upload if the given file is image
      cb(null, file.fieldname + Date.now() + '.' + extension[1]); 
    }else{
      throw new Error('Please Upload Image File');
    }
    
  }
});
var upload = multer({ storage: storage });

/* GET admin index listing. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM projects', function(error, rows, fields){
  	if(error){
  		throw error;
  	}
  	res.render('dashboard', {
  		rows: rows,
  		layout: 'layout-admin'
  	});
  });
});

/* Get add form */
router.get('/project/add', function(req, res, next){
  res.render('addProject');
});

/*Post route for add project*/
router.post('/project/add', upload.single('image'), function(req, res, next){
  //Get the posted Variable
  var title       = req.body.title;
  var description = req.body.description;
  var service     = req.body.service;
  var client      = req.body.client;
  var postDate    = req.body.postDate;

  if(req.file){
    var image             = req.file;
    var imageName         = req.file.originalname;
    var imageTempName     = req.file.name;
    var mimeType          = req.file.mimetype;
    var imageSize         = req.file.size;
    var imagePath         = req.file.path;
    var imageNameWithDate = req.file.filename;
  }else{
    var imageNameWithDate = 'noimage.png'
  }
  
  //Form Validation
  req.checkBody('title', 'Title is compulsory').notEmpty();
  req.checkBody('service', 'Service is Required').notEmpty();

  var errors = req.validationErrors();
  if(errors){
    res.render('addProject', {
      errors: errors,
      title: title,
      description: description,
      service: service,
      client: client,
      postDate: postDate
    });
  }else{
    var projects = {
      title: title,
      description: description,
      service: service,
      client: client,
      image: imageNameWithDate,
      postDate: postDate
    };

    var query = connection.query('INSERT INTO projects SET ?', projects, function(errors, result){
      if(errors){
        console.log('Insert Project Error', errors);
      }
      req.flash('success', 'New Project Added');
      res.location('/admin');
      res.redirect('/admin');
    });
  }

});

/*Get the Edit Project page*/
router.get('/project/edit/:id', function(req, res, next){
  var id = req.params.id;
  connection.query('SELECT * FROM projects WHERE id = '+id, function(error, row, fields){
    if(error){
      console.log('Edit Data Extraction ERROR', error);
    }
    res.render('editProject', {
      row: row[0],
      layout: 'layout-admin'
    });
  });
});

/*Handles Post Request for Project Edit Form*/
router.post('/project/edit/:id', upload.single('image'), function(req, res, next){
  var id = req.params.id;
  //Get the posted Variable
  var title       = req.body.title;
  var description = req.body.description;
  var service     = req.body.service;
  var client      = req.body.client;
  var postDate    = req.body.postDate;

  if(req.file){
    var image            = req.file;
    var imageName        = req.file.originalname;
    var imageTempName    = req.file.name;
    var Imagemimetype    = req.file.mimetype;
    var imageSize        = req.file.size;
    var imagePath        = req.file.path;

    var imageNameWithDate = req.file.filename;
  }else{
    var imageNameWithDate = 'noimage.png';
  }
    //Form Validation
    req.checkBody('title', 'Title field is compulsory').notEmpty();
    req.checkBody('service', 'Service field is compulsory').notEmpty();
    
    var errors = req.validationErrors();
    if(errors){
      res.render('editProject', {
        errors: errors,
        title: title,
        description: description,
        service: service,
        client: client,
        postDate: postDate
      });
    }else{
      var project = {
        title: title,
        description: description,
        service: service,
        client: client,
        postDate: postDate
      };
    }
    connection.query('UPDATE projects SET ? WHERE id ='+id, project, function(error, result){
      if(error){
        console.log('Update Project ERROR', error);
      }

      req.flash('success', 'Project Updated Successfully');
      res.location('/admin');
      res.redirect('/admin');
    });
  
});
/*Handles Delete Request*/
router.delete('/project/delete/:id', function(req, res, next){
  var id = req.params.id;

  connection.query('DELETE FROM projects WHERE id='+id, function(error, result){
    if(error){
      console.log('Delete Project ERROR', error);
    }

    req.flash('success', 'Project Deleted');
    res.location('/admin');
    res.redirect('/admin');
  });
});

module.exports = router;
