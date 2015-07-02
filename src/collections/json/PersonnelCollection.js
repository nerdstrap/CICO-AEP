define(function(require) {
    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            PersonnelModel = require('models/PersonnelModel');

    var PersonnelCollection = Backbone.Collection.extend({
        model: PersonnelModel
    });

    return PersonnelCollection;

});