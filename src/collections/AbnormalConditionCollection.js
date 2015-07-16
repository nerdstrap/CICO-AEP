define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var AbnormalConditionModel = require('models/AbnormalConditionModel');

    var AbnormalConditionCollection = Backbone.Collection.extend({
        model: AbnormalConditionModel
    });

    return AbnormalConditionCollection;
});