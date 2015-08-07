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
            purpose: {
                required: true
            },
            duration: {
                required: true
            },
            dispatchCenterId: {
                required: function () {
                    return (this.get('stationType') === StationTypeEnum.td);
                }
            },
            otherPurpose: {
                required: function () {
                    return (this.get('selectPurpose') === 'Other');
                }
            },
            adHocDescription: {
                required: function () {
                    return (this.get('checkInType') === CheckInTypeEnum.adHoc);
                }
            },
            areaName: {
                required: function () {
                    return (this.get('checkInType') === CheckInTypeEnum.adHoc);
                }
            },
            regionName: {
                required: function () {
                    return (this.get('checkInType') === CheckInTypeEnum.adHoc);
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

                if (attributes.hasOwnProperty('stationEntryLogId')) {
                    var stationEntryLogId = attributes.stationEntryLogId;
                    if (stationEntryLogId && !isNaN(stationEntryLogId)) {
                        attributes.stationEntryLogId = Number(stationEntryLogId);
                    }
                }

                if (attributes.hasOwnProperty('checkInType')) {
                    var checkInType = attributes.checkInType;
                    if (checkInType && !isNaN(checkInType)) {
                        attributes.checkInType = Number(checkInType);
                    }
                }

                var idRegex = /^\d+$/;

                if (attributes.hasOwnProperty('stationId')) {
                    var stationId = attributes.stationId;
                    if (stationId && stationId.length > 0) {
                        if (idRegex.test(stationId)) {
                            attributes.stationId = parseInt(stationId, 10);
                            attributes.stationType = StationTypeEnum.td;
                        } else {
                            attributes.stationType = StationTypeEnum.tc;
                        }
                    }
                }

                if (attributes.hasOwnProperty('personnelType')) {
                    var personnelType = attributes.personnelType;
                    if (personnelType && !isNaN(personnelType)) {
                        attributes.personnelType = Number(personnelType);
                    }
                }

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

                if (attributes.hasOwnProperty('contactNumber')) {
                    var contactNumber = attributes.contactNumber;
                    if (contactNumber) {
                        attributes.contactNumber = utils.cleanPhone(contactNumber);
                    }
                }

                if (attributes.hasOwnProperty('withCrew')) {
                    var withCrew = attributes.withCrew;
                    if (withCrew) {
                        attributes.withCrew = (withCrew === "true");
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
                    if (expectedOutTimeElapsed >= config.expirationThreshold()) {
                        attributes.checkInStatus = CheckInStatusEnum.overdue;
                    } else if (expectedOutTimeElapsed > 0) {
                        attributes.checkInStatus = CheckInStatusEnum.expired;
                    }
                }

                if (attributes.hasOwnProperty('dispatchCenterId')) {
                    var dispatchCenterId = attributes.dispatchCenterId;
                    if (dispatchCenterId && !isNaN(dispatchCenterId)) {
                        attributes.dispatchCenterId = Number(dispatchCenterId);
                    }
                }
            }

            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    });

    return StationEntryLogModel;
});