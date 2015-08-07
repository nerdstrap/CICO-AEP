define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var StationTypeEnum = require('enums/StationTypeEnum');
    var utils = require('utils');

    var StationModel = Backbone.Model.extend({

        idAttribute: 'stationId',

        set: function (key, val, options) {
            var attributes;
            if (typeof key === 'object') {
                attributes = key;
                options = val;
            } else {
                (attributes = {})[key] = val;
            }
            if (attributes) {

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

                if (attributes.hasOwnProperty('stationType')) {
                    var stationType = attributes.stationType;
                    if (stationType && !isNaN(stationType)) {
                        attributes.stationType = Number(stationType);
                    }
                }

                if (attributes.hasOwnProperty('linkedStationId')) {
                    var linkedStationId = attributes.linkedStationId;
                    if (linkedStationId && linkedStationId.length > 0) {
                        if (idRegex.test(linkedStationId)) {
                            attributes.linkedStationId = parseInt(linkedStationId, 10);
                            attributes.linkedStationType = StationTypeEnum.td;
                        } else {
                            attributes.linkedStationType = StationTypeEnum.tc;
                        }
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

                if (attributes.hasOwnProperty('hasHazard')) {
                    var hasHazard = attributes.hasHazard;
                    if (hasHazard) {
                        attributes.hasHazard = (hasHazard === "true");
                    }
                }

                if (attributes.hasOwnProperty('hasAbnormalConditions')) {
                    var hasAbnormalConditions = attributes.hasAbnormalConditions;
                    if (hasAbnormalConditions) {
                        attributes.hasAbnormalConditions = (hasAbnormalConditions === "true");
                    }
                }

                if (attributes.hasOwnProperty('hasWarnings')) {
                    var hasWarnings = attributes.hasWarnings;
                    if (hasWarnings) {
                        attributes.hasWarnings = (hasWarnings === "true");
                    }
                }

                if (attributes.hasOwnProperty('hasOpenCheckIns')) {
                    var hasOpenCheckIns = attributes.hasOpenCheckIns;
                    if (hasOpenCheckIns) {
                        attributes.hasOpenCheckIns = (hasOpenCheckIns === "true");
                    }
                }

                if (attributes.phone) {
                    attributes.phone = utils.cleanPhone(attributes.phone);
                }

                if (attributes.hasOwnProperty('transmissionDispatchCenterId')) {
                    var transmissionDispatchCenterId = attributes.transmissionDispatchCenterId;
                    if (transmissionDispatchCenterId && !isNaN(transmissionDispatchCenterId)) {
                        attributes.transmissionDispatchCenterId = Number(transmissionDispatchCenterId);
                    }
                }

                if (attributes.transmissionDispatchCenterPhone) {
                    attributes.transmissionDispatchCenterPhone = utils.cleanPhone(attributes.transmissionDispatchCenterPhone);
                }

                if (attributes.hasOwnProperty('distributionDispatchCenterId')) {
                    var distributionDispatchCenterId = attributes.distributionDispatchCenterId;
                    if (distributionDispatchCenterId && !isNaN(distributionDispatchCenterId)) {
                        attributes.distributionDispatchCenterId = Number(distributionDispatchCenterId);
                    }
                }

                if (attributes.distributionDispatchCenterPhone) {
                    attributes.distributionDispatchCenterPhone = utils.cleanPhone(attributes.distributionDispatchCenterPhone);
                }

                if (attributes.networkOperationsCenterPhone) {
                    attributes.networkOperationsCenterPhone = utils.cleanPhone(attributes.networkOperationsCenterPhone);
                }
            }

            return Backbone.Model.prototype.set.call(this, attributes, options);
        }

    });

    return StationModel;

});