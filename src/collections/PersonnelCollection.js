define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var PersonnelModel = require('models/PersonnelModel');

    var PersonnelCollection = Backbone.Collection.extend({
        model: PersonnelModel
    });

    return PersonnelCollection;
});