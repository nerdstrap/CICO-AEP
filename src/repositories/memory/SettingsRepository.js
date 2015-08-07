define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var _settings = {
        myPersonnelId: 's251201',
        expirationThreshold: 30,
        helpEmail: 'helpaep@aep.com',
        updateStationEmail: 'telecomcico@aep.com'
    };

    var SettingsRepository = function (options) {
        this.initialize.apply(this, arguments);
    };

    _.extend(SettingsRepository.prototype, {

        initialize: function (options) {
        },

        getSettings: function (options) {
            options || (options = {});
            var deferred = $.Deferred();

            var error;
            var settings = _settings;

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

    return SettingsRepository;
});