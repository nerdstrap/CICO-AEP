define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var _warnings = [
        {
            "warningId": "1",
            "stationId": "1",
            "description": "warning one"
        },
        {
            "warningId": "2",
            "stationId": "1",
            "description": "warning two"
        },
        {
            "warningId": "3",
            "stationId": "2",
            "description": "warning three"
        }
    ];

    var _getById = function (warningId) {
        return _.where(_warnings, {warningId: warningId});
    };

    var _getByStationId = function (stationId) {
        return _.where(_warnings, {stationId: stationId});
    };

    var WarningRepository = function (options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(WarningRepository.prototype, {
        initialize: function (options) {
            options || (options = {});
        },
        getWarnings: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var warnings;
            if (options.warningId) {
                warnings = _getById(options.warningId);
            } else if (options.stationId) {
                warnings = _getByStationId(options.stationId.toString());
            } else {
                warnings = [];
            }

            var results = {
                warnings: warnings
            };

            window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 20);

            return deferred.promise();
        }
    });

    return WarningRepository;
});