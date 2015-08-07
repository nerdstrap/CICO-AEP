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
            "stationType": "1",
            "regionName": "Summit",
            "areaName": "Barberton",
            "latitude": "41.038856",
            "longitude": "-81.578962",
            "phone": "6145551212",
            "transmissionDispatchCenterId": "9",
            "transmissionDispatchCenterName": "transmission",
            "transmissionDispatchCenterPhone": "6145551212",
            "distributionDispatchCenterId": "8",
            "distributionDispatchCenterName": "distribution",
            "distributionDispatchCenterPhone": "7405551212",
            "hasHazard": "false",
            "hasAbnormalConditions": "false",
            "hasWarnings": "false",
            "hasOpenCheckIns": "false",
            "radioChannel": "Sirius Hits 1",
            "emergencyContacts": "Queen Elsa of Arendelle",
            "city": "Columbus",
            "county": "Franklin",
            "state": "OH",
            "directions": "manual directions are dumb",
            "additionalData": "this station is super far from Starbucks!"
        },
        {
            "stationId": "1-1",
            "stationName": "One dash one",
            "stationType": "2",
            "regionName": "Summit",
            "areaName": "Akron",
            "latitude": "41.0408143",
            "longitude": "-81.5771596",
            "phone": "3305551212",
            "networkOperationsCenterName": "noc",
            "networkOperationsCenterPhone": "6143238888",
            "hasHazard": "true",
            "hazardDetail": "its really bad!",
            "hasAbnormalConditions": "false",
            "hasWarnings": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "stationId": "2",
            "stationName": "Second Station",
            "stationType": "1",
            "regionName": "Summit",
            "areaName": "Akron",
            "latitude": "41.0408143",
            "longitude": "-81.5771596",
            "phone": "3305551212",
            "transmissionDispatchCenterId": "9",
            "transmissionDispatchCenterName": "transmission",
            "transmissionDispatchCenterPhone": "6145551212",
            "distributionDispatchCenterId": "8",
            "distributionDispatchCenterName": "distribution",
            "distributionDispatchCenterPhone": "7405551212",
            "hasHazard": "false",
            "hasAbnormalConditions": "false",
            "hasWarnings": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "stationId": "3",
            "stationName": "Station Tres",
            "stationType": "1",
            "regionName": "Summit",
            "areaName": "Akron",
            "latitude": "41.0408143",
            "longitude": "-81.5771596",
            "phone": "3305551212",
            "transmissionDispatchCenterId": "9",
            "transmissionDispatchCenterName": "transmission",
            "transmissionDispatchCenterPhone": "6145551212",
            "distributionDispatchCenterId": "8",
            "distributionDispatchCenterName": "distribution",
            "distributionDispatchCenterPhone": "7405551212",
            "hasHazard": "false",
            "hasAbnormalConditions": "true",
            "hasWarnings": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "stationId": "4",
            "stationName": "Fore Station",
            "stationType": "1",
            "regionName": "Summit",
            "areaName": "Akron",
            "latitude": "41.0408143",
            "longitude": "-81.5771596",
            "phone": "3305551212",
            "transmissionDispatchCenterId": "9",
            "transmissionDispatchCenterName": "transmission",
            "transmissionDispatchCenterPhone": "6145551212",
            "distributionDispatchCenterId": "8",
            "distributionDispatchCenterName": "distribution",
            "distributionDispatchCenterPhone": "7405551212",
            "hasHazard": "false",
            "hasAbnormalConditions": "false",
            "hasWarnings": "true",
            "hasOpenCheckIns": "false"
        },
        {
            "stationId": "DEVIL",
            "stationName": "Devil Station",
            "stationType": "2",
            "regionName": "Summit",
            "areaName": "Akron",
            "latitude": "41.0408143",
            "longitude": "-81.5771596",
            "phone": "3305551212",
            "networkOperationsCenterName": "noc",
            "networkOperationsCenterPhone": "6143238888",
            "hasHazard": "false",
            "hasAbnormalConditions": "false",
            "hasWarnings": "false",
            "hasOpenCheckIns": "true"
        },
        {
            "stationId": "LINK",
            "stationName": "TC Linked Station",
            "linkedStationId": "101",
            "stationType": "2",
            "linkedStationName": "TD Linked Station",
            "regionName": "Summit",
            "areaName": "Akron",
            "latitude": "41.0408143",
            "longitude": "-81.5771596",
            "phone": "3305551212",
            "networkOperationsCenterName": "noc",
            "networkOperationsCenterPhone": "6143238888",
            "hasHazard": "false",
            "hasAbnormalConditions": "false",
            "hasWarnings": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "stationId": "101",
            "stationName": "TD Linked Station",
            "stationType": "1",
            "linkedStationId": "LINK",
            "linkedStationName": "TC Linked Station",
            "regionName": "Summit",
            "areaName": "Akron",
            "latitude": "41.0408143",
            "longitude": "-81.5771596",
            "phone": "3305551212",
            "transmissionDispatchCenterId": "9",
            "transmissionDispatchCenterName": "transmission",
            "transmissionDispatchCenterPhone": "6145551212",
            "distributionDispatchCenterId": "8",
            "distributionDispatchCenterName": "distribution",
            "distributionDispatchCenterPhone": "7405551212",
            "hasHazard": "false",
            "hasAbnormalConditions": "false",
            "hasWarnings": "false",
            "hasOpenCheckIns": "true"
        }
    ];

    var _clone = function (collection) {
        var clonedCollection = [];
        _.each(collection, function (item) {
            clonedCollection.push(_.clone(item));
        });
        return clonedCollection;
    };

    var _getStationByStationId = function (stationId) {
        return _clone(_.where(_stations, {stationId: stationId}));
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
        return _clone(_.sortBy(nearbyStationList, function (nearbyStation) {
            return parseFloat(nearbyStation.distance);
        }));
    };

    var _getRecentStations = function (myPersonnelId, searchResultsThreshold) {
        var recentStations = _clone(_stations);
        if (recentStations.length > searchResultsThreshold) {
            recentStations = recentStations.slice(0, searchResultsThreshold);
        }
        return recentStations;
    };

    var _getStationsByStationName = function (stationName) {
        var filteredStations = _.filter(_stations, function (_station) {
            return _station.stationName.toLowerCase().indexOf(stationName.toLowerCase()) >= 0;
        });
        return _clone(filteredStations);
    };

    var StationRepository = function (options) {
        this.initialize.apply(this, arguments);
    };

    _.extend(StationRepository.prototype, {

        initialize: function (options) {
        },

        getStationByStationId: function (options) {
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
            var myPersonnelId = config.myPersonnelId();
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

    return StationRepository;
});