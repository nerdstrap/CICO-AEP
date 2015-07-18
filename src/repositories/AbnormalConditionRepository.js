define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var config = require('config');

    var AbnormalConditionRepository = function (options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(AbnormalConditionRepository.prototype, {
        initialize: function (options) {
            options || (options = {});
        },
        getAbnormalConditions: function(options) {
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

    return AbnormalConditionRepository;
});