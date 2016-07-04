'use strict';

var Localization = require('../models/localization');

module.exports = {
	start: function(io){
		setInterval(function(){
			var filterDate = new Date();
			Localization.find({
				date: {
					$gte: (filterDate.getTime() - 60000)
				}
			}).sort([['date', 'desc']]).exec(function(err, data) {
				var localizations = {}, badges = {};
				data.forEach(function(item){
					if(localizations[item.AP] === undefined) localizations[item.AP] = { badges: [] };
					if(badges[item.badge] === undefined){
						badges[item.badge] = item.badge;
						localizations[item.AP].badges.push(item.badge);
					}
				});
				io.sockets.emit('news', localizations);
		  });
		}, 1000);
	}
};