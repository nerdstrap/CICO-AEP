'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var WarningModel = Backbone.Model.extend({

    idAttribute: 'stationWarningId'

});

module.exports = WarningModel;