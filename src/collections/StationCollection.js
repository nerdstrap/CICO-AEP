'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var StationModel = require('models/StationModel');

var StationCollection = Backbone.Collection.extend({
    model: StationModel
});

module.exports = StationCollection;