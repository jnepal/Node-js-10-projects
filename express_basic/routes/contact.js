var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

/*GET Contact Page*/
router.get('/', function(req, res, next){
	res.render('contact', {'title' : 'Contact'});
});

router.post('/send', function(req, res, next){
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: '',
			pass: ''
		}
	});

	var mailOptions = {
		from: 'James Nepal <jnepalames@gmail.com>',
		to: '',
		subject: 'Node Mailer Test',
		text: 'You have a New Message with the following details Name: '+req.body.name+' Email: '+req.body.email+' Message: '+req.body.message+'',
		html: '<b>This Message was Send to ....If you receive this message by mistake.Please Delete this message</b>'

	};
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
			res.redirect('/');
		}else{
			console.log('Message Sent: '+info.response)
			res.redirect('/');
		}
	});
});

module.exports = router;