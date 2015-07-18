define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var _abnormalConditions = [
        {
            "abnormalConditionId": "1",
            "stationId": "1",
            "description": "abnormalCondition one"
        },
        {
            "abnormalConditionId": "2",
            "stationId": "1",
            "description": "abnormalCondition two"
        },
        {
            "abnormalConditionId": "3",
            "stationId": "2",
            "description": "abnormalCondition three"
        }
    ];

    var _getById = function (abnormalConditionId) {
        return _.where(_abnormalConditions, {abnormalConditionId: abnormalConditionId});
    };

    var _getByLocusId = function (stationId) {
        return _.where(_abnormalConditions, {stationId: stationId});
    };

    var AbnormalConditionRepository = function (options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(AbnormalConditionRepository.prototype, {
        initialize: function (options) {
            options || (options = {});
        },
        getAbnormalConditions: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var abnormalConditions;
            if (options.abnormalConditionId) {
                abnormalConditions = _getById(options.abnormalConditionId);
            } else if (options.stationId) {
                abnormalConditions = _getByLocusId(options.stationId.toString());
            } else {
                abnormalConditions = [];
            }

            var results = {
                abnormalConditions: abnormalConditions
            };

            window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 20);

            return deferred.promise();
        }
    });

    return AbnormalConditionRepository;
});