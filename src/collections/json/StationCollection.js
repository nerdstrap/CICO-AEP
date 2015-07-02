define(function(require) {
    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            StationModel = require('models/StationModel');

    var StationCollection = Backbone.Collection.extend({
        model: StationModel
    });

    return StationCollection;
});