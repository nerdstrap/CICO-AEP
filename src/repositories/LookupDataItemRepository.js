'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var _purposes = require('repositories/purposes.json');
var _durations = require('repositories/durations.json');
var _areas = require('repositories/areas.json');


var _getPurposes = function () {
    return _purposes;
};

var _getDurations = function () {
    return _durations;
};

var _getAreas = function () {
    return _areas;
};

var LookupDataItemRepository = function (options) {
    this.initialize.apply(this, arguments);
};

_.extend(LookupDataItemRepository.prototype, {

    initialize: function (options) {
    },

    getOptions: function (options) {
        var deferred = $.Deferred();

        var error;
        var purposes = _getPurposes();
        var durations = _getDurations();
        var areas = _getAreas();

        var results = {
            purposes: purposes,
            durations: durations,
            areas: areas
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

module.exports = LookupDataItemRepository;