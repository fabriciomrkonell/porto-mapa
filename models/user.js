'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	username: String,
  password: String,
  type: Number // 1 - Administrador, 2 - Normal
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);