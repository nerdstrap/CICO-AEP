'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var utils = require('lib/utils');
var config = require('lib/config');
var _stationEntryLogs = require('repositories/stationEntryLogs.json');

var _getStationEntryLogByStationEntryLogId = function (stationEntryLogId) {
    return _.where(_stationEntryLogs, {stationEntryLogId: stationEntryLogId});
};

var _getOpenStationEntryLogsByStationId = function (stationId) {
    var filteredStationEntryLogs = _.filter(_stationEntryLogs, function (stationEntryLog) {
        return stationEntryLog.stationId === stationId && stationEntryLog.hasOwnProperty('outTime') === false;
    });
    return filteredStationEntryLogs;
};

var _getOpenStationEntryLogsByPersonnelId = function (personnelId) {
    var filteredStationEntryLogs = _.filter(_stationEntryLogs, function (stationEntryLog) {
        return stationEntryLog.personnelId === personnelId && stationEntryLog.hasOwnProperty('outTime') === false;
    });
    return filteredStationEntryLogs;
};

var _getRecentStationEntryLogsByStationId = function (stationId) {
    var filteredStationEntryLogs = _.filter(_stationEntryLogs, function (stationEntryLog) {
        return stationEntryLog.stationId === stationId && stationEntryLog.hasOwnProperty('outTime') === true;
    });
    return filteredStationEntryLogs;
};

var _getRecentStationEntryLogsByPersonnelId = function (personnelId) {
    var filteredStationEntryLogs = _.filter(_stationEntryLogs, function (stationEntryLog) {
        return stationEntryLog.personnelId === personnelId && stationEntryLog.hasOwnProperty('outTime') === true;
    });
    return filteredStationEntryLogs;
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
    stationEntryLog.inTime = new Date().getTime().toString();
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

    getStationEntryLog: function (options) {
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

    getMyOpenStationEntryLogs: function () {
        var deferred = $.Deferred();

        var myPersonnelId = config.myIdentity.personnelId;
        var stationEntryLogs = _getOpenStationEntryLogsByPersonnelId(myPersonnelId);

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

    getOpenStationEntryLogs: function (options) {
        options || (options = {});
        var deferred = $.Deferred();

        var error;
        var stationEntryLogs;
        if (options.stationId) {
            stationEntryLogs = _getOpenStationEntryLogsByStationId(options.stationId.toString());
        } else if (options.personnelId) {
            stationEntryLogs = _getOpenStationEntryLogsByPersonnelId(options.personnelId);
        }

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

    getRecentStationEntryLogs: function (options) {
        options || (options = {});
        var deferred = $.Deferred();

        var error;
        var stationEntryLogs;
        if (options.stationId) {
            stationEntryLogs = _getRecentStationEntryLogsByStationId(options.stationId.toString());
        } else if (options.personnelId) {
            stationEntryLogs = _getRecentStationEntryLogsByPersonnelId(options.personnelId);
        }

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
        var stationEntryLogs = _getNearbyStationEntryLogs(options.latitude, options.longitude, options.distanceThreshold);

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

module.exports = StationEntryLogRepository;