'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var utils = require('lib/utils');
var config = require('lib/config');
var _stations = require('repositories/stations.json');

var _getStationByStationId = function (stationId) {
    return _.where(_stations, {stationId: stationId});
};

var _getNearbyStations = function (latitude, longitude, distanceThreshold, searchResultsThreshold) {
    var coords = {
        latitude: latitude,
        longitude: longitude
    };
    utils.computeDistances(coords, _stations);
    var nearbyStationList = _.filter(_stations, function (station) {
        return station.distance <= distanceThreshold
    });
    if (nearbyStationList.length > searchResultsThreshold) {
        nearbyStationList = nearbyStationList.slice(0, searchResultsThreshold);
    }
    return _.sortBy(nearbyStationList, function (nearbyStation) {
        return parseFloat(nearbyStation.distance);
    });
};

var _getRecentStations = function (myPersonnelId, searchResultsThreshold) {
    var recentStations = _stations;
    if (recentStations.length > searchResultsThreshold) {
        recentStations = recentStations.slice(0, searchResultsThreshold);
    }
    return recentStations;
};

var _getStationsByStationName = function (stationName) {
    var filteredStations = _.filter(_stations, function (_station) {
        return _station.stationName.toLowerCase().indexOf(stationName.toLowerCase()) >= 0;
    });
    return filteredStations;
};

var StationRepository = function (options) {
    this.initialize.apply(this, arguments);
};

_.extend(StationRepository.prototype, {

    initialize: function (options) {
    },

    getStation: function (options) {
        options || (options = {});
        var deferred = $.Deferred();

        var error;
        var stations = _getStationByStationId(options.stationId.toString());

        var results = {
            stations: stations
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

    getNearbyStations: function (options) {
        options || (options = {});
        var deferred = $.Deferred();

        var error;
        var stations = _getNearbyStations(options.latitude, options.longitude, options.distanceThreshold, options.searchResultsThreshold);

        var results = {
            stations: stations
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

    getRecentStations: function (options) {
        options || (options = {});
        var deferred = $.Deferred();

        var error;
        var myPersonnelId = config.myPersonnelId;
        var stations = _getRecentStations(myPersonnelId, options.searchResultsThreshold);

        var results = {
            stations: stations
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

    getStationsByStationName: function (options) {
        options || (options = {});
        var deferred = $.Deferred();

        var error;
        var stations = _getStationsByStationName(options.stationName);

        var results = {
            stations: stations
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

module.exports = StationRepository;