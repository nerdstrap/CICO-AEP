define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var StationModel = require('models/StationModel');

    var StationCollection = Backbone.Collection.extend({
        model: StationModel
    });

    return StationCollection;
});