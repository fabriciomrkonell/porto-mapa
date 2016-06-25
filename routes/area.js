'use strict';

var express = require('express'),
		router = express.Router(),
    service = require('../services/service'),
		Area = require('../models/area');

router.get('/', function(req, res, next) {
	Area.find().exec(function(err, data) {
    if (err) throw console.log({ error: true, message: 'Area: error.', data: err });
  	res.send({ error: false, message: 'Area: success.', data: data });
  });
});

router.post('/', service.isAdmin, function(req, res, next) {
	var area = new Area();
	area.description = req.body.description,
  area.update_at = new Date;
  area.created_at = new Date;
  area.save(function(err, data) {
	  if (err) throw console.log({ error: true, message: 'Area: error.', data: err });
	  res.send({ error: false, message: 'Area: success.', data: data });
	});
});

router.post('/update', service.isAdmin, function(req, res, next) {
  Area.findById(req.body._id, function(err, area) {
    if(area === null){
      throw console.log({ error: true, message: 'Area: error.', data: err });
    }
    area.description = req.body.description,
    area.update_at = new Date;
    area.save(function(err, data) {
      res.send({ error: false, message: 'Area: success.', data: data });
    });
  });
});

router.delete('/:id', service.isAdmin, function(req, res, next) {
  Area.remove({
    _id: req.param('id')
  }, function(err, data) {
    if (err) throw console.log({ error: true, message: 'Area: error.', data: err });
    res.send({ error: false, message: 'Area: success.', data: data });
  });
});

module.exports = router;