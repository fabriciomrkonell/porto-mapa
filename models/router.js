'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Router = mongoose.model('Router', new Schema({
  mac: String,
  color: String,
  polygons: Array,
  update_at: Date,
  created_at: Date,
  areaId: { type: Schema.Types.ObjectId, ref: 'Area' }
}));

module.exports = Router;