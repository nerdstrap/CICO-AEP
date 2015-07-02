define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            ModelStatesEnum = require('enums/ModelStatesEnum'),
            stations = require('models/memory/services/stations'),
            env = require('env');

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
        urlRoot: function() {
            return env.getApiUrl() + '/station';
        },
        initialize: function() {
            this.state = ModelStatesEnum.initial;
            this.isLoaded = false;
            this.listenTo(this, 'request', this.onRequest);
            this.listenTo(this, 'sync', this.onSync);
            this.listenTo(this, 'error', this.onError);
        },
        sync: function(method, model, options) {
            if (method === "read") {
                var xhr = options.xhr = stations.findById(parseInt(this.id)).done(function(data) {
                    setTimeout(function() {
                        options.success(data, 'success', null);
                    }, 2000);
                });
                model.trigger('request', model, xhr, options);
                return xhr;
            }
        },
        onRequest: function(model, xhr, options) {
            this.state = ModelStatesEnum.loading;
        },
        onSync: function(model, xhr, options) {
            this.state = ModelStatesEnum.loaded;
            this.isLoaded = true;
        },
        onError: function(model, xhr, options) {
            this.state = ModelStatesEnum.error;
        },
        set: function(attributes, options) {
            if (typeof attributes === 'object') {
                if (attributes && attributes.latitude && attributes.longitude) {
                    var lat = attributes.latitude;
                    var lng = attributes.longitude;
                    if (lat && lng && lat.length > 0 && lng.length > 0 && !isNaN(lat) && !isNaN(lng)) {
                        attributes.coords = {latitude: Number(lat), longitude: Number(lng)};
                        attributes.hasCoordinates = true;
                    } else {
                        attributes.hasCoordinates = false;
                    }
                }

                if (attributes.distanceInMiles) {
                    attributes.distanceInMiles = Number(attributes.distanceInMiles.toFixed(2));
                }

                attributes.hasHazard = attributes && attributes.hazardFlag;
                attributes.hasRestricted = attributes && attributes.restrictedFlag;
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        },
        wrapSuccessCallback: function(successCallback) {
            var currentContext = this;
            return function(model, resp, options) {
                currentContext.state = ModelStatesEnum.loaded;
                if (successCallback) {
                    successCallback(model, resp, options);
                }
            };
        },
        wrapErrorCallback: function(errorCallback) {
            var currentContext = this;
            return function(model, resp, options) {
                currentContext.state = ModelStatesEnum.error;
                if (errorCallback) {
                    errorCallback(model, resp, options);
                }
            };
        }

    });

    return StationModel;

});