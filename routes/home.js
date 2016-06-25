'use strict';

var express = require('express'),
		service = require('../services/service'),
		router = express.Router();

router.get('/', function(req, res, next) {
 res.sendfile('./view/index.html');
});

router.get('/configuration', service.isAdmin, function(req, res, next) {
	res.sendfile('./view/configuration.html');
});

module.exports = router;