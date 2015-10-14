'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var config = require('lib/config');

var AbnormalConditionRepository = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(AbnormalConditionRepository.prototype, {
    initialize: function (options) {
        options || (options = {});
    },
    getAbnormalConditions: function (options) {
        options || (options = {});
        var data = $.param(options);

        return $.ajax({
            contentType: 'application/json',
            data: data,
            dataType: 'json',
            type: 'GET',
            url: config.apiUrl() + '/abnormalCondition/find'
        });
    },
});

module.exports = AbnormalConditionRepository;