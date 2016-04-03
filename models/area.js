'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Area = mongoose.model('Area', new Schema({
  description: String,
  color: String,
  visible: Boolean,
  active: Boolean,
  polygons: Array,
  update_at: Date,
  created_at: Date
}));

module.exports = Area;