var express = require('express');
var http = require('http');

var app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);

var usernames =[];


server.listen(process.env.PORT || 3000);

app.get('/', function(req, res, next){
	res.sendFile(__dirname +'/index.html');
});

io.sockets.on('connection', function(socket){
	
	//New User Event
	socket.on('new user', function(data, callback){
		if(usernames.indexOf(data) !== -1){
			callback(false);
		}else{
			callback(true);
			socket.username = data;
			usernames.push(socket.username);
			updateUsernames();
		}
	});
	
	//Update Username
	var updateUsernames = function(){
		io.sockets.emit('usernames', usernames);
	};
	
	//Send Message Event
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});

	//Disconnect Event
	socket.on('disconnect', function(data){
		if(!socket.username){
			return;
		}
		usernames.splice(usernames.indexOf(socket.username, 1));
		updateUsernames();
	});
});//connection is event