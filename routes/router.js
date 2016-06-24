'use strict';

var express = require('express'),
		router = express.Router(),
		Router = require('../models/router');

router.get('/', function(req, res, next) {
	Router.find().exec(function(err, data) {
    if (err) throw console.log({ error: true, message: 'Router: error.', data: err });
  	res.send({ error: false, message: 'Router: success.', data: data });
  });
});

router.post('/', function(req, res, next) {
	var router = new Router();
	router.mac = req.body.mac,
  router.color = '#000000';
  router.polygons = req.body.polygons;
  router.areaId = req.body.areaId;
  router.update_at = new Date;
  router.created_at = new Date;
  router.save(function(err, data) {
	  if (err) throw console.log({ error: true, message: 'Router: error.', data: err });
	  res.send({ error: false, message: 'Router: success.', data: data });
	});
});

router.post('/update', function(req, res, next) {
  Router.findById(req.body._id, function(err, router) {
    if(router === null){
      throw console.log({ error: true, message: 'Router: error.', data: err });
    }
    router.mac = req.body.mac;
    router.color = req.body.color;
    router.areaId = req.body.areaId;
    router.update_at = new Date;
    router.save(function(err, data) {
      res.send({ error: false, message: 'Router: success.', data: data });
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Router.remove({
    _id: req.param('id')
  }, function(err, data) {
    if (err) throw console.log({ error: true, message: 'Router: error.', data: err });
    res.send({ error: false, message: 'Router: success.', data: data });
  });
});

module.exports = router;