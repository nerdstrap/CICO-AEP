define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var _abnormalConditions = [
        {
            "abnormalConditionId": "500890",
            "stationId": "1",
            "hasOutage": "true",
            "title": "Vine 13KV - CAP 4",
            "startTime": "1399217400000",
            "details": "John Bell reports 6 cans out on 13kV Cap 4"
        }, {
            "abnormalConditionId": "500889",
            "stationId": "1",
            "hasOutage": "false",
            "title": "Vine 13KV - BUS B",
            "startTime": "1399217280000",
            "details": "Future 13kV feeder cubicle position (cb 14) has 2000A CB here, racked out and tagged Hold per S. Ray"
        },
        {
            "abnormalConditionId": "500888",
            "stationId": "1",
            "hasOutage": "false",
            "title": "Vine 13KV - BUS B",
            "startTime": "1399217160000",
            "details": "Bus B 13kV Pot Tr fuses and fuse holders have been removed after double tested bad."
        },
        {
            "abnormalConditionId": "500886",
            "stationId": "1",
            "hasOutage": "true",
            "title": "Vine 13KV - CAP 3",
            "startTime": "1399216800000",
            "details": "Tom Musselman reported he found 5 blown fuses on Cap 3 13kV CB 13 and should not be placed in service."
        }
    ];

    var _getAbnormalConditionsByStationId = function (stationId) {
        return _.where(_abnormalConditions, {stationId: stationId});
    };

    var AbnormalConditionRepository = function (options) {
        this.initialize.apply(this, arguments);
    };

    _.extend(AbnormalConditionRepository.prototype, {

        initialize: function (options) {
        },

        getAbnormalConditionsByStationId: function (options) {
            options || (options = {});
            var deferred = $.Deferred();

            var error;
            var abnormalConditions = _getAbnormalConditionsByStationId(options.stationId.toString());

            var results = {
                abnormalConditions: abnormalConditions
            };

            window.setTimeout(function () {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(results);
                }
            }, 5);

            return deferred.promise();
        }
    });

    return AbnormalConditionRepository;
});