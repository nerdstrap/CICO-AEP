define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var utils = require('utils');
    var config = require('config');

    var _stations = [
        {
            "stationId": "1",
            "stationName": "Station One",
            "regionName": "Summit",
            "areaName": "Barberton",
            "latitude": "41.038856",
            "longitude": "-81.578962",
            "phone": "6145551212",
            "hasHazard": "false",
            "hasAbnormalConditions": "false",
            "hasWarnings": "false",
            "hasOpenCheckIns": "true"
        },
        {
            "stationId": "2",
            "stationName": "Second Station",
            "regionName": "Summit",
            "areaName": "Akron",
            "latitude": "41.0408143",
            "longitude": "-81.5771596",
            "phone": "3305551212",
            "hasHazard": "true",
            "hazardDetail": "its really bad",
            "hasAbnormalConditions": "false",
            "hasWarnings": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "stationId": "3",
            "stationName": "Station Tres",
            "regionName": "Summit",
            "areaName": "Akron",
            "latitude": "41.0408143",
            "longitude": "-81.5771596",
            "phone": "3305551212",
            "hasHazard": "false",
            "hasAbnormalConditions": "false",
            "hasWarnings": "false",
            "hasOpenCheckIns": "true"
        },
        {
            "stationId": "4",
            "stationName": "Fore Station",
            "regionName": "Summit",
            "areaName": "Akron",
            "latitude": "41.0408143",
            "longitude": "-81.5771596",
            "phone": "3305551212",
            "hasHazard": "false",
            "hasAbnormalConditions": "false",
            "hasWarnings": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "stationId": "DEVIL",
            "stationName": "Devil Station",
            "regionName": "Summit",
            "areaName": "Akron",
            "latitude": "41.0408143",
            "longitude": "-81.5771596",
            "phone": "3305551212",
            "hasHazard": "true",
            "lockDetail": "demons are running amok!",
            "hasAbnormalConditions": "true",
            "hasWarnings": "true",
            "hasOpenCheckIns": "true"
        }
    ];

    var _getById = function (stationId) {
        return _.where(_stations, {stationId: stationId});
    };

    var _getBySearchQuery = function (searchQuery) {
        var filteredStations = _.filter(_stations, function (_station) {
            var resultant = _station.stationName.toLowerCase().indexOf(searchQuery.toLowerCase());
            return _station.stationName.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0;
        });
        return filteredStations;
    };

    var _getByCoords = function (coords, distanceThreshold, searchResultsThreshold) {
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

    var StationRepository = function (options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(StationRepository.prototype, {
        initialize: function (options) {
            options || (options = {});
        },
        getNearbyStations: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var stations = _getByCoords({latitude: options.lat, longitude: options.lng}, config.distanceThreshold, config.searchResultsThreshold);

            var results = {
                stations: stations
            };

            window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 20);

            return deferred.promise();
        },
        getStations: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var stations;
            if (options.stationId) {
                stations = _getById(options.stationId.toString());
            } else if (options.stationName) {
                stations = _getBySearchQuery(options.stationName);
            } else if (options.coords) {
                stations = _getByCoords(options.coords, config.app.distanceThreshold, config.app.searchResultsThreshold);
            } else if (options.admin) {
                stations = _stations;
            } else {
                stations = [];
            }

            var results = {
                stations: stations
            };

            window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 20);

            return deferred.promise();
        }
    });

    return StationRepository;
});