'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var utils = require('lib/utils');

var StationModel = Backbone.Model.extend({

    idAttribute: 'stationId'

});

module.exports = StationModel;