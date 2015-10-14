'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var AbnormalConditionModel = require('models/AbnormalConditionModel');

var AbnormalConditionCollection = Backbone.Collection.extend({
    model: AbnormalConditionModel
});

module.exports = AbnormalConditionCollection;