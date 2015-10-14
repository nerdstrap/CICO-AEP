'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var PersonnelModel = Backbone.Model.extend({

    idAttribute: 'personnelId'

});

module.exports = PersonnelModel;