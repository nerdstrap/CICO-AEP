'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var _abnormalConditions = require('repositories/abnormalConditions.json');

var _getAbnormalConditionsByStationId = function (stationId) {
    return _.where(_abnormalConditions, {stationId: stationId});
};

var AbnormalConditionRepository = function (options) {
    this.initialize.apply(this, arguments);
};

_.extend(AbnormalConditionRepository.prototype, {

    initialize: function (options) {
    },

    getAbnormalConditions: function (options) {
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

module.exports = AbnormalConditionRepository;