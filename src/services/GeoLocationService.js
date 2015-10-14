'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var config = require('lib/config');
var utils = require('lib/utils');

var GeoLocationService = function (options) {
    this.initialize.apply(this, arguments);
};

_.extend(GeoLocationService.prototype, {

    initialize: function (options) {
    },

    getCurrentPosition: function () {
        var currentContext = this;
        var deferred = $.Deferred();

        if (window.navigator && window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
                function () {
                    deferred.resolveWith(currentContext, arguments);
                },
                function () {
                    deferred.rejectWith(currentContext, arguments);
                },
                config.positionOptions
            );
        } else {
            var capabilityError = new Error(utils.getResource('gpsNotSupportedErrorMessageText'));
            deferred.rejectWith(currentContext, [capabilityError]);
        }

        return deferred.promise();
    }
});

module.exports = GeoLocationService;