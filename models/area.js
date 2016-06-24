'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Area = mongoose.model('Area', new Schema({
  description: String,
  update_at: Date,
  created_at: Date
}));

module.exports = Area;