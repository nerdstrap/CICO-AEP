define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var StationTypeEnum = require('enums/StationTypeEnum');

    var AbnormalConditionModel = Backbone.Model.extend({

        idAttribute: 'abnormalConditionId',

        set: function (key, val, options) {
            var attributes;
            if (typeof key === 'object') {
                attributes = key;
                options = val;
            } else {
                (attributes = {})[key] = val;
            }
            if (attributes) {

                if (attributes.hasOwnProperty('abnormalConditionId')) {
                    var abnormalConditionId = attributes.abnormalConditionId;
                    if (abnormalConditionId && abnormalConditionId.length > 0) {
                        attributes.abnormalConditionId = parseInt(abnormalConditionId, 10);
                    }
                }

                if (attributes.hasOwnProperty('hasOutage')) {
                    var hasOutage = attributes.hasOutage;
                    if (hasOutage) {
                        attributes.hasOutage = (hasOutage === "true");
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

                if (attributes.hasOwnProperty('startTime')) {
                    var startTime = attributes.startTime;
                    if (startTime && !isNaN(startTime)) {
                        attributes.startTime = new Date(Number(startTime));
                    }
                }

                return Backbone.Model.prototype.set.call(this, attributes, options);
            }
        }
    });

    return AbnormalConditionModel;

});