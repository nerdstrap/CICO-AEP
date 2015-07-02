define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            StationWarningModel = require('models/StationWarningModel'),
            env = require('env');

    var StationWarningCollection = Backbone.Collection.extend({
        model: StationWarningModel,
        getStationWarnings: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/station/warning'
            });
        },
        getStationWarningsByStationId: function(stationId, successCallback, errorCallback) {
            var currentContext = this;

            var request = {
                'stationId': stationId
            };
            $.when(this.getStationWarnings(request)).done(function(getStationWarningsResponse) {
                currentContext.reset(getStationWarningsResponse.stationWarnings);
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

    return StationWarningCollection;
});
