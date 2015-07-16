define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var WarningModel = require('models/WarningModel');

    var WarningCollection = Backbone.Collection.extend({
        model: WarningModel
    });

    return WarningCollection;
});
