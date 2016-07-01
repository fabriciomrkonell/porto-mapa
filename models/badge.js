'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Badge = mongoose.model('Badge', new Schema({
  companyId: Number,
  badgeId: Number,
  employeeFirstName: String,
  employeeLastName: String,
  companyName: String,
  employeePicture: String,
  mac: String
}));

module.exports = Badge;