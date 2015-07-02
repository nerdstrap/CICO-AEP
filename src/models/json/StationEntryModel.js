define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            
            validation = require('backbone-validation'),
            env = require('env'),
            CheckInTypeEnum = require('enums/CheckInTypeEnum');

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
                'stationType': null
            };
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
                if (attributes.stationId) {
                    if (attributes.stationId === "A_HOC") {
                        attributes.checkInType = CheckInTypeEnum.adHoc;
                        delete attributes.stationId;
                    } else {
                        attributes.checkInType = CheckInTypeEnum.station;
                    }
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

                if (attributes.hasOwnProperty('companyName')) {
                    var companyName = attributes.companyName;
                    if (companyName.length > 0) {
                        attributes.thirdParty = true;
                    }
                }

                if (attributes.hasOwnProperty('distanceInMiles')) {
                    attributes.distanceInMiles = attributes.distanceInMiles.toFixed(2);
                }
            } else if (attributes === "contactNumber") {
                options = env.getPhoneFixedNumber(options);
                if (this.derivedAttributes) {
                    var fixedContact = env.getPhoneFixedNumber(options);
                    var formattedContact = env.getFormattedPhoneNumber(options);
                    this.derivedAttributes.fixedContact = fixedContact;
                    this.derivedAttributes.formattedContact = formattedContact;
                }
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        },
        validation: {
            stationId: {
                required: function() {
                    return (this.get('checkInType') === CheckInTypeEnum.station);
                }
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
            },
            description: {
                required: function() {
                    return (this.get('checkInType') === CheckInTypeEnum.adHoc);
                }
            },
            areaName: {
                required: function() {
                    return (this.get('checkInType') === CheckInTypeEnum.adHoc);
                }
            },
            regionName: {
                required: function() {
                    return (this.get('checkInType') === CheckInTypeEnum.adHoc);
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
            //return (this.get('inTime') + (this.get('duration') + minutes) * 60 * 1000) < new Date().getTime();
            return this.getExpectedCheckOutTime().addMinutes(minutes) < new Date();
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
        }
    });

    return StationEntryModel;

});