//Require Module
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');//files system

//Array of Mime Types
var mimeTypes = {
	"html" : "text/html",
	"jpgeg" : "image/jpeg",
	"jpg" : "image/jpeg",
	"png" : "image/png",
	"js" : "text/javascript",
	"css" : "text/css"
};

//Create Server

var server = http.createServer(function(req, res){
	var uri = url.parse(req.url).pathname;
	var fileName = path.join(process.cwd(), unescape(uri));//process.cwd return working directory
	console.log("Loading "+ uri);
	var stats;

	try{
		stats = fs.lstatSync(fileName);
	}catch(e){
		res.writeHead(404, {'Content-type': 'text/plain'});
		res.write('404 Not Found \n');
		res.end();
		return;
	}

	//check if the file directory
	if(stats.isFile()){
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
		res.writeHead(200, {'Content-type': mimeType});

		var fileStream = fs.createReadStream(fileName);
		fileStream.pipe(res);
	}else if(stats.isDirectory()){
		res.writeHead(302, {
			'Location' : 'index.html'
		});//302 is redirect
	}else{
		res.writeHead(500, {'Content-type': 'text/plain'});
		res.write('500 Internal Error \n');
		res.end();
	}
});

server.listen(3000, '127.0.0.1');
console.log('Server Running at http://127.0.0.1:3000');