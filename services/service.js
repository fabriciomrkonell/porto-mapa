'use strict';

module.exports = {
	isAutenticate: function(req, res, next){
		if(req.user){
			next()
		}else{
			res.redirect('/login');
		}
	},
	isAdmin: function(req, res, next){
		if(req.user.type === 1){
			next()
		}else{
			res.redirect('/');
		}
	}
};