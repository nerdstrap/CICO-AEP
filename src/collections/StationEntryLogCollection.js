'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var StationEntryLogModel = require('models/StationEntryLogModel');

var StationEntryLogCollection = Backbone.Collection.extend({
    model: StationEntryLogModel
});

module.exports = StationEntryLogCollection;