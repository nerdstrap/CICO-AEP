define(function(require) {
    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            AbnormalConditionModel = require('models/AbnormalConditionModel'),
            env = require('env');

    var AbnormalConditionCollection = Backbone.Collection.extend({
        model: AbnormalConditionModel,
        getAbnormalConditions: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/abnormalCondition/find/open'
            });
        },
        getAbnormalConditionsByStationId: function(stationId, successCallback, errorCallback) {
            var currentContext = this;

            var request = {
                'stationId': stationId
            };

            $.when(this.getAbnormalConditions(request)).done(function(getAbnormalConditionsResponse) {
                currentContext.reset(getAbnormalConditionsResponse.abnormalConditions);
                if (successCallback) {
                    successCallback(currentContext);
                }
            }).fail(function() {
                currentContext.reset();
                if (errorCallback) {
                    errorCallback();
                }
            });
        }
    });

    return AbnormalConditionCollection;
});