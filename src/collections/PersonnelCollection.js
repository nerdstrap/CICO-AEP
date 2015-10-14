'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var PersonnelModel = require('models/PersonnelModel');

var PersonnelCollection = Backbone.Collection.extend({
    model: PersonnelModel
});

module.exports = PersonnelCollection;