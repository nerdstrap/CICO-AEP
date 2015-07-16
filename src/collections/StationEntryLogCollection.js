define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var StationEntryLogModel = require('models/StationEntryLogModel');

    var StationEntryLogCollection = Backbone.Collection.extend({
        model: StationEntryLogModel
    });

    return StationEntryLogCollection;
});