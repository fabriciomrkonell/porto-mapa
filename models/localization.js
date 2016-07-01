'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Localization = mongoose.model('Localization', new Schema({
  badge: String,
  AP: String,
  signal: Number,
  date: Date
}));

module.exports = Localization;