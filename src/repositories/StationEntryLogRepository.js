define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var config = require('config');

    var StationEntryLogRepository = function (options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(StationEntryLogRepository.prototype, {
        initialize: function (options) {
            options || (options = {});
        },
        getOpenStationEntryLogs: function(){
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: config.apiUrl() + '/stationEntryLog/find/open'
            });
        },
        getNearbyStationEntryLogs: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: config.apiUrl() + '/stationEntryLog/find/nearby'
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
                url: config.apiUrl() + '/stationEntryLog/find/recent'
            });
        },
        getStationEntryLogs: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: config.apiUrl() + '/stationEntryLog/find'
            });
        },
        postCheckIn: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'POST',
                url: config.apiUrl() + '/stationEntryLog/checkIn'
            });
        },
        postUpdateCheckIn: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'PUT',
                url: config.apiUrl() + '/stationEntryLog/updateCheckIn'
            });
        },
        postCheckOut: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'PUT',
                url: config.apiUrl() + '/stationEntryLog/checkOut'
            });
        },
    });

    return StationEntryLogRepository;
});