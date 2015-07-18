define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var _settings = {
        myPersonnelId: 's251201',
        expirationThreshold: 30,
        contactHelpEmailAddress: 'helpaep@aep.com',
        contactHelpSubject: 'CICO Help'
    };

    var SettingsRepository = function (options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(SettingsRepository.prototype, {
        initialize: function (options) {
            options || (options = {});
        },
        getSettings: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var results = {
                settings: _settings
            };

            window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 20);

            return deferred.promise();
        }
    });

    return SettingsRepository;
});