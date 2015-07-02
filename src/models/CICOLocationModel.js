define(function(require) {
    /**
     inspired by: https://github.com/cpbtechnology/backbone-geolocation-api/blob/master/js/LocationModel.js
     */

    'use strict';
    var $ = require('jquery'),
            Backbone = require('backbone'),
            
            env = require('env'),
            globals = require('globals'),
            module = require('module');


    var translateGeoLocationErrorMessage = function(error) {
        var msg = "Unable to get current position at this time.";
        if (typeof (error) === "string") {
            msg = error;
        } else {
            switch (error.code)
            {
                case error.TIMEOUT:
                    msg = 'Timeout';
                    break;
                case error.POSITION_UNAVAILABLE:
                    msg = 'Position unavailable';
                    break;
                case error.PERMISSION_DENIED:
                    msg = 'Ensure the location service is turned on for this browser.  GPS Permission denied';
                    break;
                case error.UNKNOWN_ERROR:
                    msg = 'Unknown error';
                    break;
            }
        }

        if (error.message && error.message.length > 0) {
            msg += ": " + error.message;
        }

        return msg;
    };

    var CicoLocationModel = Backbone.Model.extend({
        defaults: {
            isGeolocationEnabled: null,
            currentPosition: {},
            gpsDefaults: {}
        },
        initialize: function(options) {
            options || (options = {});
            console.debug('CicoLocationModel.initialize');
            var masterConfig = (module.config && module.config()) || {};
            this.gpsDefaults = {
                timeout: masterConfig.timeout || 5000,
                enableHighAccuracy: masterConfig.enableHighAccuracy || false,
                maximumAge: masterConfig.maximumAge || 60000
            };

            _.bindAll(this, 'onGetCurrentPositionSuccess', 'onGetCurrentPositionError');
        },
        refreshCurrentPosition: function() {
            if (this.getGeolocationEnabled()) {
                var options = $.extend({}, this.gpsDefaults);
                globals.window.navigator.geolocation.getCurrentPosition(
                        this.onGetCurrentPositionSuccess,
                        this.onGetCurrentPositionError,
                        options
                        );
            }
        },
        getCurrentPosition: function(successCallback, errorCallback) {
            if (this.getGeolocationEnabled()) {
                var currentContext = this;
                var options = $.extend({}, this.gpsDefaults);
                globals.window.navigator.geolocation.getCurrentPosition(
                        function(position) {
                            currentContext.onGetCurrentPositionSuccess(position);
                            if (successCallback) {
                                successCallback(position);
                            }
                        },
                        function(error) {
                            var msg = translateGeoLocationErrorMessage(error);
                            currentContext.onGetCurrentPositionError(msg);
                            if (errorCallback) {
                                errorCallback(msg);
                            }
                        },
                        options
                        );
            } else {
                errorCallback("Position unavailable: Geolocation is not supported");
            }
        },
        getGeolocationEnabled: function() {
            if (globals.window.navigator && globals.window.navigator.geolocation) {
                //Update state if it is out of sync.
                if (!this.get("isGeolocationEnabled")) {
                    this.trigger('geolocationStateChange', this.set({'isGeolocationEnabled': true}));
                }
            }
            else {
                //Update state if it is out of sync.
                if (this.get("isGeolocationEnabled")) {
                    this.trigger('geolocationStateChange', this.set({'isGeolocationEnabled': false}));
                }
            }

            return this.get("isGeolocationEnabled");
        },
        onGetCurrentPositionSuccess: function(position) {
            if (position && position.coords) {
                console.debug('CicoLocationModel.onGetCurrentPositionSuccess(' + position.coords.latitude + ', ' + position.coords.longitude + ')');
                this.trigger('currentPositionChange', this.set({'currentPosition': position}));
            } else {
                this.trigger('error', this.set({'errorMessage': 'Geolocation was not found.'}));
            }
        },
        onGetCurrentPositionError: function(msg) {
            this.trigger('error', this.set({'errorMessage': msg}));
        },
        /**
         * Accepts either one parameter (remotePosition coordinates) or two (currentPosition coordinates, remotePosition coordinates)
         * @param {object} position1
         * @param {object} position2
         */
        calculateDistanceFromCurrentPosition: function(position1, position2) {
            var currentPosition = this.get("currentPosition").coords,
                    remotePosition;

            if (typeof (position2) !== "undefined") {
                currentPosition = position1;
                remotePosition = position2;
            } else {
                remotePosition = position1;
            }

            try {
                var lat2 = remotePosition.latitude;

                var lon2 = remotePosition.longitude;
                var lat1 = currentPosition.latitude;
                var lon1 = currentPosition.longitude;

                var earthRadius = 3956.0883313286096695299;

                var x1 = lat2 - lat1;

                var dLat = x1.toRad();
                var x2 = lon2 - lon1;
                var dLon = x2.toRad();
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return Number((earthRadius * c).toFixed(2));
            }
            catch (ex) {
                console.error(ex);
            }
        }
    });

    var instance = new CicoLocationModel();
    CicoLocationModel.getInstance = function() {
        return instance;
    };

    return CicoLocationModel;

});