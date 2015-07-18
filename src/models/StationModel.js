define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var StationModel = Backbone.Model.extend({

        /**
         *
         */
        idAttribute: 'stationId',

        /**
         *
         * @param key
         * @param val
         * @param options
         * @returns {StationModel}
         */
        set: function (key, val, options) {
            var attributes;
            if (typeof key === 'object') {
                attributes = key;
                options = val;
            } else {
                (attributes = {})[key] = val;
            }
            if (attributes) {
                if (attributes.hasOwnProperty('latitude')) {
                    var latitude = attributes.latitude;
                    if (latitude && !isNaN(latitude)) {
                        attributes.latitude = Number(latitude);
                    }
                }

                if (attributes.hasOwnProperty('longitude')) {
                    var longitude = attributes.longitude;
                    if (longitude && !isNaN(longitude)) {
                        attributes.longitude = Number(longitude);
                    }
                }

                if (attributes.hasOwnProperty('distanceInMiles') || attributes.hasOwnProperty('distance')) {
                    var distance;
                    if (attributes.hasOwnProperty('distanceInMiles')) {
                        distance = attributes.distanceInMiles;
                        delete attributes.distanceInMiles;
                    }
                    if (attributes.hasOwnProperty('distance')) {
                        distance = attributes.distance;
                    }
                    if (distance && !isNaN(distance)) {
                        attributes.distance = Number(distance);
                    }
                }
            }

            return Backbone.Model.prototype.set.call(this, attributes, options);
        }

    });

    return StationModel;

});