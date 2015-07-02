define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            StationEntryModel = require('models/StationEntryModel'),
            env = require('env');

    var StationEntryCollection = Backbone.Collection.extend({
        model: StationEntryModel,
        getOpenStationEntryLogs: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/stationEntryLog/find/open'
            });
        },
        getRecentStationEntryLogs: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/stationEntryLog/find/recent'
            });
        },
        getOpenStationEntries: function(successCallback, errorCallback) {
            var currentContext = this;
            var request;

            $.when(this.getOpenStationEntryLogs(request)).done(function(getStationEntryLogsResponse) {
                currentContext.reset(getStationEntryLogsResponse.stationEntryLogs);
                if (successCallback) {
                    successCallback(currentContext);
                }
            }).fail(function() {
                currentContext.reset();
                if (errorCallback) {
                    errorCallback();
                }
            });
        },
        getRecentStationEntriesByStationId: function(stationId, stationType, successCallback, errorCallback) {
            var currentContext = this;
            var request = {
                'stationId': stationId,
                'stationType': stationType
            };

            $.when(this.getRecentStationEntryLogs(request)).done(function(getStationEntryLogsResponse) {
                currentContext.reset(getStationEntryLogsResponse.stationEntryLogs);
                if (successCallback) {
                    successCallback(currentContext);
                }
            }).fail(function() {
                currentContext.reset();
                if (errorCallback) {
                    errorCallback();
                }
            });
        },
        getRecentStationEntriesByPersonnel: function(personnel, successCallback, errorCallback) {
            var currentContext = this;
            var request = {};
            if (personnel.has("outsideId") && personnel.get("outsideId").length > 0) {
                request.outsideId = personnel.get("outsideId");
            } else {
                request.userName = personnel.get("userName");
            }

            $.when(this.getRecentStationEntryLogs(request)).done(function(getStationEntryLogsResponse) {
                currentContext.reset(getStationEntryLogsResponse.stationEntryLogs);
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

    return StationEntryCollection;

});