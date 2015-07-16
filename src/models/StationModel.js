define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var StationModel = Backbone.Model.extend({
        defaults: {
            stationId: '',
            regionName: '',
            areaName: '',
            dispatchCenterId: '',
            dispatchCenter: '',
            hasOpenCheckIns: false,
            hasCoordinates: false,
            hasRestricted: false,
            hasHazard: false,
            phone: '',
            radio: '',
            contacts: '',
            city: '',
            county: '',
            state: '',
            district: ' ',
            latitude: '',
            longitude: '',
            directions: '',
            stationData: '',
            restrictedFlag: false,
            hazardFlag: false,
            stationType: 'TD',
            linkedStationId: '',
            linkedStationName: ''
        },
        idAttribute: 'stationId',
        set: function(attributes, options) {
            if (typeof attributes === 'object') {
                if (attributes && attributes.latitude && attributes.longitude) {
                    var lat = attributes.latitude;
                    var lng = attributes.longitude;
                    if (lat && lng && lat.toString().length > 0 && lng.toString().length > 0 && !isNaN(lat) && !isNaN(lng)) {
                        attributes.coords = {latitude: Number(lat), longitude: Number(lng)};
                        attributes.hasCoordinates = true;
                    } else {
                        attributes.hasCoordinates = false;
                    }
                }

                if (attributes.hasOwnProperty('distanceInMiles')) {
                    var distance = attributes.distanceInMiles;
                    if (distance && distance.length > 0 && !isNaN(distance)) {
                        attributes.distanceInMiles = Number(distance).toFixed(2);
                    }
                }

                attributes.hasHazard = attributes && attributes.hasHazard;
                attributes.hasRestricted = attributes && attributes.restrictedFlag;
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        }

    });

    return StationModel;

});