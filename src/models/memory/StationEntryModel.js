define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            ModelStatesEnum = require('enums/ModelStatesEnum'),
            validation = require('backbone-validation'),
            stationEntries = require('models/memory/services/stationEntries'),
            env = require('env');

    var StationEntryModel = Backbone.Model.extend({
        idAttribute: 'stationEntryLogId',
        getDefaultsForRendering: function() {
            return {
                'stationEntryLogId': null,
                'stationId': null,
                'stationName': null,
                'stationPhone': null,
                'purpose': null,
                'inTime': null,
                'outTime': null,
                'createdDate': null,
                'createdBy': null,
                'contact': null,
                'dcId': null,
                'hasCrew': false,
                'dispatchCenterId': null,
                'userName': null,
                'outsideId': null,
                'additionalInfo': null
            };
        },
        urlRoot: function() {
            return env.getApiUrl() + '/stationEntry';
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
                var xhr = options.xhr = stationEntries.getOne().done(function(data) {
                    setTimeout(function() {
                        options.success(data, 'success', null);
                    }, 2000);
                });
                model.trigger('request', model, xhr, options);
                return xhr;
            }
            if (method === "create") {
                var xhr = options.xhr = stationEntries.getOne().done(function(data) {
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
                if (!this.derivedAttributes) {
                    this.derivedAttributes = {
                        'fixedContact': null,
                        'formattedContact': null,
                        'fixedStationPhone': null,
                        'formattedStationPhoneNumber': null,
                        'InOutTimeString': null,
                        'checkedOut': false,
                        'name': null,
                        'name_url': null
                    };
                }
                if (attributes.userName) {
                    this.derivedAttributes.name = attributes.userName;
                }

                if (attributes.contact) {
                    var fixedContact = env.getPhoneFixedNumber(attributes.contact);
                    var formattedContact = env.getFormattedPhoneNumber(attributes.contact);
                    this.derivedAttributes.fixedContact = fixedContact;
                    this.derivedAttributes.formattedContact = formattedContact;
                }

                if (attributes.stationPhone) {
                    var fixedStationPhone = env.getPhoneFixedNumber(attributes.stationPhone);
                    var formattedStationPhone = env.getFormattedPhoneNumber(attributes.stationPhone);
                    this.derivedAttributes.fixedStationPhone = fixedStationPhone;
                    this.derivedAttributes.formattedStationPhone = formattedStationPhone;
                }

                var inTime, outTime, InOutTimeString = "";
                if (attributes.inTime) {
                    try {
                        inTime = new Date(attributes.inTime);
                        InOutTimeString = inTime.cicoDate();
                    }
                    catch (ex) {
                    }
                }

                if (attributes.outTime) {
                    this.derivedAttributes.checkedOut = true;
                    try {
                        outTime = new Date(attributes.outTime);
                        if (inTime.isSameDay(outTime)) {
                            InOutTimeString += " to " + outTime.cicoTime();
                        } else {
                            InOutTimeString += " to " + outTime.cicoDate();
                        }
                    }
                    catch (ex2) {
                        console.error(ex2);
                    }
                }
                this.derivedAttributes.InOutTimeString = InOutTimeString;

                if (attributes.latitude && attributes.longitude) {
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
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        },
        validation: {
            stationId: {
                required: true
            },
            contactNumber: {
                required: true,
                pattern: 'digits',
                length: 10
            },
            selectPurpose: {
                required: true
            },
            duration: {
                required: true
            },
            dispatchCenterId: {
                required: true
            },
            otherPurpose: {
                required: function() {
                    return (this.get('selectPurpose') === 'Other');
                }
            }
        },
        durationExpired: function() {
            return this.durationExpiredByMinutes(0);
        },
        durationExpiredMax: function() {
            return this.durationExpiredByMinutes(env.getMaxDurExpiration());
        },
        // duration expired by how many minutes        
        durationExpiredByMinutes: function(minutes) {
            if (this.outTime) {
                return false;
            }
            return (this.get('inTime') + (this.get('duration') + minutes) * 60 * 1000) < new Date().getTime();
        },
        getIntimeDate: function() {
            if (this.get('inTime')) {
                return new Date(this.get('inTime'));
            }
            else {
                return null;
            }
        },
        getExpectedCheckOutTime: function() {
            var inDate = this.getIntimeDate();
            if (inDate && this.get("duration")) {
                var currentDuration = this.get("duration");
                return inDate.addMinutes(currentDuration);
            }
            return null;
        },
        getExpectedCheckOutTimeString: function() {
            var expectedCheckOutTime = this.getExpectedCheckOutTime();
            if (expectedCheckOutTime) {
                var expectedCheckOutTimeString = '';
                expectedCheckOutTimeString = expectedCheckOutTime.cicoDate();
                return expectedCheckOutTimeString;
            }
            else {
                return "unable to determine expected checkout date";
            }
        },
        checkin: function(successCallback, errorCallback) {
            var wrappedSuccessCallback = this.wrapSuccessCallback(successCallback),
                    wrappedErrorCallback = this.wrapErrorCallback(errorCallback);

            var xhr = this.save(
                    this.attributes,
                    {
                        success: wrappedSuccessCallback,
                        error: wrappedErrorCallback
                    }
            );

            return xhr;
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

    return StationEntryModel;

});