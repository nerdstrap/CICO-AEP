define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var StationEntryModel = require('models/StationEntryModel');

    var StationEntryCollection = Backbone.Collection.extend({
        model: StationEntryModel
    });

    return StationEntryCollection;
});