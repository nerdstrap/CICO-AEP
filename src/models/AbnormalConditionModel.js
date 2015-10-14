'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var AbnormalConditionModel = Backbone.Model.extend({

    idAttribute: 'abnormalConditionId'
});

module.exports = AbnormalConditionModel;