'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var _settings = require('repositories/settings.json');

var _getSettings = function () {
    return _settings;
};

var SettingsRepository = function (options) {
    this.initialize.apply(this, arguments);
};

_.extend(SettingsRepository.prototype, {

    initialize: function (options) {
    },

    getSettings: function () {
        var deferred = $.Deferred();

        var error;
        var settings = _getSettings;

        var results = {
            settings: settings
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

module.exports = SettingsRepository;