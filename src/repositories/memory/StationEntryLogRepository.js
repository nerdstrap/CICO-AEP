define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var utils = require('utils');
    var config = require('config');

    var _stationStationEntryLogs = [
        {
            "stationEntryLogId": "2",
            "stationId": "1",
            "stationName": "Station 1",
            "personnelId": "s251201",
            "userName": "Baltic, Michael",
            "firstName": "Michael",
            "lastName": "Baltic",
            "middleName": "E",
            "fullName": "Michael E Baltic",
            "purpose": "Site Maintenance",
            "additionalInfo": "Testing",
            "inTime": "1418828925433",
            "contactNumber": "9-1-6145622909",
            "duration": "180",
            "latitude": "39.96500000",
            "longitude": "-83.00555555",
            "regionName": "Ohio",
            "areaName": "Groveport",
            "hasGroupCheckIn": "False",
            "email": "mebaltic@aep.com"
        },
        {
            "stationEntryLogId": "3",
            "stationId": "666",
            "stationName": "Station One",
            "personnelId": "s251201",
            "userName": "Baltic, Michael",
            "firstName": "Michael",
            "lastName": "Baltic",
            "middleName": "E",
            "fullName": "Michael E Baltic",
            "purpose": "Site Inspection",
            "additionalInfo": "Very first checkin",
            "inTime": "1418828712472",
            "outTime": "1418828962736",
            "contactNumber": "6149177430",
            "duration": "210",
            "latitude": "39.96505555",
            "longitude": "-83.00544444",
            "regionName": "Ohio",
            "areaName": "Groveport",
            "hasGroupCheckIn": "False",
            "email": "mebaltic@aep.com"
        },
        {
            "stationEntryLogId": "4",
            "stationId": "666",
            "stationName": "Station 1",
            "personnelId": "s251201",
            "userName": "Baltic, Michael",
            "firstName": "Michael",
            "lastName": "Baltic",
            "middleName": "E",
            "fullName": "Michael E Baltic",
            "purpose": "Site Maintenance",
            "additionalInfo": "Testing",
            "inTime": "1418828925433",
            "outTime": "1418828962736",
            "contactNumber": "9-1-6145622909",
            "duration": "180",
            "latitude": "39.96500000",
            "longitude": "-83.00555555",
            "regionName": "Ohio",
            "areaName": "Groveport",
            "hasGroupCheckIn": "False",
            "email": "mebaltic@aep.com"
        }
    ];

    var _getById = function (stationStationEntryLogId) {
        return _.where(_stationStationEntryLogs, {stationStationEntryLogId: stationStationEntryLogId});
    };

    var _getByStationId = function (stationId) {
        return _.where(_stationStationEntryLogs, {stationId: stationId});
    };

    var _getOpenByStationId = function (stationId) {
        var filteredStationEntryLogs = _.filter(_stationStationEntryLogs, function (stationStationEntryLog) {
            return stationStationEntryLog.stationId === stationId && stationStationEntryLog.hasOwnProperty('outTime') === false;
        });
        return filteredStationEntryLogs;
    };

    var _getRecentByStationId = function (stationId) {
        var filteredStationEntryLogs = _.filter(_stationStationEntryLogs, function (stationStationEntryLog) {
            return stationStationEntryLog.stationId === stationId && stationStationEntryLog.hasOwnProperty('outTime') === true;
        });
        return filteredStationEntryLogs;
    };

    var _getByPersonnelId = function (personnelId) {
        return _.where(_stationStationEntryLogs, {personnelId: personnelId});
    };

    var _getOpenByPersonnelId = function (personnelId) {
        var filteredStationEntryLogs = _.filter(_stationStationEntryLogs, function (stationStationEntryLog) {
            return stationStationEntryLog.personnelId === personnelId && stationStationEntryLog.hasOwnProperty('outTime') === false;
        });
        return filteredStationEntryLogs;
    };

    var _getRecentByPersonnelId = function (personnelId) {
        var filteredStationEntryLogs = _.filter(_stationStationEntryLogs, function (stationStationEntryLog) {
            return stationStationEntryLog.personnelId === personnelId && stationStationEntryLog.hasOwnProperty('outTime') === true;
        });
        return filteredStationEntryLogs;
    };

    var _getByStatus = function (stationStationEntryLogs, status) {
        return _.where(stationStationEntryLogs, function (stationStationEntryLog) {
            return stationStationEntryLog.hasOwnProperty('outTime') === status;
        });
    };

    var _postCheckIn = function (stationStationEntryLog) {
        stationStationEntryLog.stationStationEntryLogId = utils.getNewGuid();
        stationStationEntryLog.inTime = new Date().getTime();
        _stationStationEntryLogs.push(stationStationEntryLog);
        return stationStationEntryLog;
    };

    var _postEditCheckIn = function (stationStationEntryLogAttributes) {
        var match = _.find(_stationStationEntryLogs, function (stationStationEntryLog) {
            return stationStationEntryLog.stationStationEntryLogId === stationStationEntryLogAttributes.stationStationEntryLogId;
        });

        if (match) {
            match.duration = stationStationEntryLogAttributes.duration;
            match.additionalInfo = stationStationEntryLogAttributes.additionalInfo;
        }

        return match;
    };

    var _postCheckOut = function (stationStationEntryLogAttributes) {
        var match = _.find(_stationStationEntryLogs, {stationStationEntryLogId: stationStationEntryLogAttributes.stationStationEntryLogId});

        if (match) {
            match.outTime = new Date().getTime();
        }

        return match;
    };

    var _getByCoords = function (coords, distanceThreshold, searchResultsThreshold) {
        utils.computeDistances(coords, _stationStationEntryLogs);
        var nearbyStationEntryLogs = _.filter(_stationStationEntryLogs, function (stationStationEntryLog) {
            return stationStationEntryLog.distance <= distanceThreshold
        });
        if (nearbyStationEntryLogs.length > searchResultsThreshold) {
            nearbyStationEntryLogs = nearbyStationEntryLogs.slice(0, searchResultsThreshold);
        }
        var sortedNearbyStationEntryLogs = _.sortBy(nearbyStationEntryLogs, function (nearbyStationEntryLog) {
            return parseFloat(nearbyStationEntryLog.distance);
        });

        return sortedNearbyStationEntryLogs;
    };

    var StationEntryLogRepository = function (options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(StationEntryLogRepository.prototype, {
        initialize: function (options) {
            options || (options = {});
        },
        getStationEntryLogs: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var stationStationEntryLogs;
            if (options.stationStationEntryLogId) {
                stationStationEntryLogs = _getById(options.stationStationEntryLogId);
            } else if (options.stationId) {
                if (options.open) {
                    stationStationEntryLogs = _getOpenByStationId(options.stationId.toString());
                } else if (options.recent) {
                    stationStationEntryLogs = _getRecentByStationId(options.stationId.toString());
                } else {
                    stationStationEntryLogs = _getByStationId(options.stationId.toString());
                }
            } else if (options.personnelId) {
                if (options.open) {
                    stationStationEntryLogs = _getOpenByPersonnelId(options.personnelId);
                } else if (options.recent) {
                    stationStationEntryLogs = _getRecentByPersonnelId(options.personnelId);
                } else {
                    stationStationEntryLogs = _getByPersonnelId(options.personnelId);
                }
            } else if (options.coords) {
                stationStationEntryLogs = _getByCoords(options.coords, config.app.distanceThreshold, config.app.searchResultsThreshold);
            } else if (options.open) {
                var personnelId = config.myPersonnel.personnelId;
                stationStationEntryLogs = _getOpenByPersonnelId(personnelId);
            } else {
                stationStationEntryLogs = _stationStationEntryLogs;
            }

            var results = {
                stationStationEntryLogs: stationStationEntryLogs
            };

            window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 20);

            return deferred.promise();
        },
        getOpenStationEntryLogs: function(){
            var currentContext = this;
            var deferred = $.Deferred();

            var myPersonnelId = config.myPersonnelId();
            var stationEntryLogs = _getOpenByPersonnelId(myPersonnelId);

            var results = {
                stationEntryLogs: stationEntryLogs
            };

            window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 20);

            return deferred.promise();
        },
        postCheckIn: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var stationStationEntryLog = _postCheckIn(options);

            var results = {
                stationStationEntryLog: stationStationEntryLog
            };

            window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 3000);

            return deferred.promise();
        },
        postEditCheckIn: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var stationStationEntryLog = _postEditCheckIn(options);

            var results = {
                stationStationEntryLog: stationStationEntryLog
            };

            window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 3000);

            return deferred.promise();
        },
        postCheckOut: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var stationStationEntryLog = _postCheckOut(options);

            var results = {
                stationStationEntryLog: stationStationEntryLog
            };

            window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 3000);

            return deferred.promise();
        }
    });

    return StationEntryLogRepository;
});