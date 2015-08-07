define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var utils = require('utils');
    var config = require('config');

    var _stationEntryLogs = [
        {
            "stationEntryLogId": "666",
            "checkInType": "2",
            "adHocDescription": "ad-hoc check-in 1",
            "stationType": "2",
            "personnelId": "s251201",
            "userName": "Baltic, Michael",
            "firstName": "Michael",
            "lastName": "Baltic",
            "middleName": "E",
            "fullName": "Michael E Baltic",
            "purpose": "Site Maintenance",
            "additionalInfo": "Testing",
            "inTime": "1418828925433",
            "contactNumber": "6145622909",
            "duration": "180",
            "latitude": "39.96500000",
            "longitude": "-83.00555555",
            "regionName": "Ohio",
            "areaName": "Groveport",
            "hasGroupCheckIn": "False",
            "email": "mebaltic@aep.com",
            "dispatchCenterId": "1"
        },
        {
            "stationEntryLogId": "2",
            "checkInType": "1",
            "stationId": "DEVIL",
            "stationName": "Devil Station",
            "stationType": "1",
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
        },
        {
            "stationEntryLogId": "3",
            "checkInType": "1",
            "stationId": "DEVIL",
            "stationName": "Devil Station",
            "stationType": "1",
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
            "checkInType": "1",
            "stationId": "DEVIL",
            "stationName": "Devil Station",
            "stationType": "1",
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

    var _clone = function (collection) {
        var clonedCollection = [];
        _.each(collection, function (item) {
            clonedCollection.push(_.clone(item));
        });
        return clonedCollection;
    };

    var _toString = function (attributes) {
        var stringAttributes = {};
        for (var a in attributes) {
            if (attributes.hasOwnProperty(a)) {
                var attribute = attributes[a];
                if (attribute) {
                    if (a === "expectedOutTime") {
                        stringAttributes[a] = attribute.getMilliseconds().toString();
                    } else {
                        stringAttributes[a] = attribute.toString();
                    }
                }
            }
        }
        return stringAttributes;
    };

    var _getStationEntryLogByStationEntryLogId = function (stationEntryLogId) {
        return _clone(_.where(_stationEntryLogs, {stationEntryLogId: stationEntryLogId}));
    };

    var _getMyOpenStationEntryLog = function (personnelId) {
        var filteredStationEntryLogs = _.filter(_stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.personnelId === personnelId && stationEntryLog.hasOwnProperty('outTime') === false;
        });
        return _clone(filteredStationEntryLogs);
    };

    var _getRecentStationEntryLogsByStationId = function (stationId) {
        var filteredStationEntryLogs = _.filter(_stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.stationId === stationId && stationEntryLog.hasOwnProperty('outTime') === true;
        });
        return _clone(filteredStationEntryLogs);
    };

    var _getRecentStationEntryLogsByPersonnelId = function (personnelId) {
        var filteredStationEntryLogs = _.filter(_stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.personnelId === personnelId && stationEntryLog.hasOwnProperty('outTime') === true;
        });
        return _clone(filteredStationEntryLogs);
    };

    var _getRecentStationEntryLogsByUserName = function (userName) {
        var filteredStationEntryLogs = _.filter(_stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.userName === userName && stationEntryLog.hasOwnProperty('outTime') === true;
        });
        return _clone(filteredStationEntryLogs);
    };

    var _getNearbyStationEntryLogs = function (latitude, longitude, distanceThreshold, searchResultsThreshold) {
        var coords = {
            latitude: latitude,
            longitude: longitude
        };
        utils.computeDistances(coords, _stationEntryLogs);
        var nearbyStationEntryLogs = _.filter(_stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.distance <= distanceThreshold
        });
        if (nearbyStationEntryLogs.length > searchResultsThreshold) {
            nearbyStationEntryLogs = nearbyStationEntryLogs.slice(0, searchResultsThreshold);
        }
        return _.sortBy(nearbyStationEntryLogs, function (nearbyStationEntryLog) {
            return parseFloat(nearbyStationEntryLog.distance);
        });
    };

    var _checkIn = function (stationEntryLog) {
        stationEntryLog.stationEntryLogId = utils.getNewGuid();
        stationEntryLog.inTime = new Date().getTime().toString;
        var stationEntryLogData = _.extend({}, stationEntryLog);
        _stationEntryLogs.push(stationEntryLogData);
        return stationEntryLog;
    };

    var _editCheckIn = function (stationEntryLogAttributes) {
        var match = _.find(_stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.stationEntryLogId === stationEntryLogAttributes.stationEntryLogId.toString();
        });

        if (match) {
            match.duration = stationEntryLogAttributes.duration.toString();
            match.additionalInfo = stationEntryLogAttributes.additionalInfo;
        }

        return _.extend({}, match);
    };

    var _checkOut = function (stationEntryLogAttributes) {
        var match = _.find(_stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.stationEntryLogId === stationEntryLogAttributes.stationEntryLogId.toString();
        });

        if (match) {
            match.additionalInfo = stationEntryLogAttributes.additionalInfo;
            match.outTime = new Date().getTime().toString();
        }

        return _.extend({}, match);
    };

    var StationEntryLogRepository = function (options) {
        this.initialize.apply(this, arguments);
    };

    _.extend(StationEntryLogRepository.prototype, {

        initialize: function (options) {
        },

        getStationEntryLogByStationEntryLogId: function (options) {
            options || (options = {});
            var deferred = $.Deferred();

            var error;
            var stationEntryLogs = _getStationEntryLogByStationEntryLogId(options.stationEntryLogId.toString());

            var results = {
                stationEntryLogs: stationEntryLogs
            };

            window.setTimeout(function () {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(results);
                }
            }, 5);

            return deferred.promise();
        },

        getMyOpenStationEntryLog: function () {
            var currentContext = this;
            var deferred = $.Deferred();

            var myPersonnelId = config.myPersonnelId();
            var stationEntryLogs = _getMyOpenStationEntryLog(myPersonnelId);

            var error;
            var results = {
                stationEntryLogs: stationEntryLogs
            };

            window.setTimeout(function () {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(results);
                }
            }, 5);

            return deferred.promise();
        },

        getRecentStationEntryLogsByStationId: function (options) {
            options || (options = {});
            var deferred = $.Deferred();

            var error;
            var stationEntryLogs = _getRecentStationEntryLogsByStationId(options.stationEntryLogId.toString());

            var results = {
                stationEntryLogs: stationEntryLogs
            };

            window.setTimeout(function () {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(results);
                }
            }, 5);

            return deferred.promise();
        },

        getRecentStationEntryLogsByPersonnelId: function (options) {
            options || (options = {});
            var deferred = $.Deferred();

            var error;
            var stationEntryLogs = _getRecentStationEntryLogsByPersonnelId(options.stationEntryLogId.toString());

            var results = {
                stationEntryLogs: stationEntryLogs
            };

            window.setTimeout(function () {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(results);
                }
            }, 5);

            return deferred.promise();
        },

        getRecentStationEntryLogsByUserName: function (options) {
            options || (options = {});
            var deferred = $.Deferred();

            var error;
            var stationEntryLogs = _getRecentStationEntryLogsByUserName(options.stationEntryLogId.toString());

            var results = {
                stationEntryLogs: stationEntryLogs
            };

            window.setTimeout(function () {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(results);
                }
            }, 5);

            return deferred.promise();
        },

        getNearbyStationEntryLogs: function (options) {
            options || (options = {});
            var deferred = $.Deferred();

            var error;
            var stationEntryLogs = _getNearbyStationEntryLogs(options.stationEntryLogId.toString());

            var results = {
                stationEntryLogs: stationEntryLogs
            };

            window.setTimeout(function () {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(results);
                }
            }, 5);

            return deferred.promise();

        },

        checkIn: function (options) {
            options || (options = {});
            var deferred = $.Deferred();

            var stationEntryLog = _checkIn(options);

            var error;
            var results = {
                stationEntryLog: stationEntryLog
            };

            window.setTimeout(function () {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(results);
                }
            }, 5);

            return deferred.promise();
        },

        editCheckIn: function (options) {
            options || (options = {});
            var deferred = $.Deferred();

            var error;
            var stationEntryLog = _editCheckIn(options);

            var results = {
                stationEntryLog: stationEntryLog
            };

            window.setTimeout(function () {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(results);
                }
            }, 5);

            return deferred.promise();
        },

        checkOut: function (options) {
            options || (options = {});
            var deferred = $.Deferred();

            var error;
            var stationEntryLog = _checkOut(options);

            var results = {
                stationEntryLog: stationEntryLog
            };

            window.setTimeout(function () {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(results);
                }
            }, 5);

            return deferred.promise();
        }

    });

    return StationEntryLogRepository;
});