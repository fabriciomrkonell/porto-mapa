'use strict';

var express = require('express'),
		router = express.Router(),
		passport = require('passport'),
		User = require('../models/user');

router.get('/login', function(req, res, next) {
 res.sendfile('./view/login.html');
});

router.post('/login', function(req, res, next) {
   passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login?error'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/init', function(req, res, next) {
	User.remove().exec(function(err, data) {
		User.register(new User({
	    username: 'admin@sensul.com',
	    type: 1
	  }), 'adminsensul', function(err, user1) {
			User.register(new User({
		    username: 'imbituba@sensul.com',
		    type: 2
		  }), 'imbitubasensul', function(err, user2) {
				res.send({ error: false, message: 'This application was successfully started.' });
		  });
	  });
  });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  req.logOut();
  res.redirect('/')
});

module.exports = router;