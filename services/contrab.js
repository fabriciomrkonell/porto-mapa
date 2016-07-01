'use strict';

var Localization = require('../models/localization');

module.exports = {
	start: function(req, res, next){
		setInterval(function(){

			var ll = new Localization();
	ll.AP = 'dasdasd',
  ll.bagge = '#000000';
  ll.signal = 10;
  ll.data = new Date();
  ll.save(function(err, data) {
  	console.log(err);
	  console.log('dasdasdadsa');
	});


			Localization.find().exec(function(err, data) {
				console.log(err);
		    console.log(data);
		  });

		}, 5000);
	}
};