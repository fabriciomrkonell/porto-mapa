'use strict';

var express = require('express'),
		router = express.Router(),
    service = require('../services/service'),
		Badge = require('../models/badge');

router.post('/', function(req, res, next) {
	Badge.find({
    mac: req.body.badges
  }).select('_id employeeFirstName companyName').exec(function(err, data) {
    if (err) throw console.log({ error: true, message: 'Badge: error.', data: err });
  	res.send({ error: false, message: 'Badge: success.', data: data });
  });
});

router.get('/:id', function(req, res, next) {
  Badge.find({
    _id: req.param('id')
  }).select('_id employeeFirstName companyName employeePicture').exec(function(err, data) {
    if (err) throw console.log({ error: true, message: 'Badge: error.', data: err });
    res.send({ error: false, message: 'Badge: success.', data: data.shift() });
  });
});
module.exports = router;