define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var CheckInStatusEnum = require('enums/CheckInStatusEnum');
    var CheckInTypeEnum = require('enums/CheckInTypeEnum');
    var StationTypeEnum = require('enums/StationTypeEnum');
    var PersonnelTypeEnum = require('enums/PersonnelTypeEnum');
    var utils = require('utils');
    var config = require('config');


    var StationEntryLogModel = Backbone.Model.extend({
        idAttribute: 'stationEntryLogId',
        validation: {
            stationId: {
                required: function () {
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
                required: function () {
                    return (this.get('selectPurpose') === 'Other');
                }
            },
            description: {
                required: function () {
                    return (this.get('checkInType') === CheckInTypeEnum.adhoc);
                }
            },
            areaName: {
                required: function () {
                    return (this.get('checkInType') === CheckInTypeEnum.adhoc);
                }
            },
            regionName: {
                required: function () {
                    return (this.get('checkInType') === CheckInTypeEnum.adhoc);
                }
            }
        },
        /**
         *
         * @param key
         * @param val
         * @param options
         * @returns {EntryLogModel}
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

                if (attributes.hasOwnProperty('inTime') && attributes.hasOwnProperty('duration')) {
                    var inTime = attributes.inTime;
                    var duration = attributes.duration;
                    if (inTime && !isNaN(inTime) && duration && !isNaN(duration)) {
                        attributes.inTime = new Date(Number(inTime));
                        attributes.duration = Number(duration);
                        attributes.expectedOutTime = utils.addMinutes(attributes.inTime, attributes.duration);
                        attributes.checkInStatus = CheckInStatusEnum.checkedIn;
                    }
                }

                if (attributes.hasOwnProperty('outTime')) {
                    var outTime = attributes.outTime;
                    if (outTime && !isNaN(outTime)) {
                        attributes.outTime = new Date(Number(outTime));
                        attributes.actualDuration = (attributes.outTime - attributes.inTime);
                        attributes.checkInStatus = CheckInStatusEnum.checkedOut;
                    }
                }

                if (attributes.checkInStatus === CheckInStatusEnum.checkedIn) {
                    var expectedOutTimeElapsed = new Date() - attributes.expectedOutTime;
                    if (expectedOutTimeElapsed >= config.expirationThreshold) {
                        attributes.checkInStatus = CheckInStatusEnum.overdue;
                    } else if (expectedOutTimeElapsed > 0) {
                        attributes.checkInStatus = CheckInStatusEnum.expired;
                    }
                }
            }

            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    });

    return StationEntryLogModel;
});