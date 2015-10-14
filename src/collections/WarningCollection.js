'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var WarningModel = require('models/WarningModel');

var WarningCollection = Backbone.Collection.extend({
    model: WarningModel
});

module.exports = WarningCollection;