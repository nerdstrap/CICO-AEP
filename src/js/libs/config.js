define(function(require) {
    'use strict';

    var module = require('module');
    var masterConfig = module.config();
    var _apiUrl = masterConfig.apiUrl || '';
    var _siteRoot = masterConfig.siteRoot || '';
    var _expirationThreshold = masterConfig.expirationThreshold || 30;
    var _contactHelpEmailAddress = masterConfig.contactHelpEmailAddress || 'helpaep@aep.com';
    var _contactHelpSubject = masterConfig.contactHelpSubject || 'CICO Help';

    var config = {
        apiUrl: function() {
            return _apiUrl;
        },
        siteRoot: function() {
            return _siteRoot;
        },
        expirationThreshold: function() {
            return _expirationThreshold;
        },
        contactHelpEmailAddress: function() {
            return _contactHelpEmailAddress;
        },
        contactHelpSubject: function() {
            return _contactHelpSubject;
        },
        overrideConfig: function(settings) {
            if (settings) {
                _expirationThreshold = settings.expirationThreshold;
                _contactHelpEmailAddress = settings.contactHelpEmailAddress;
                _contactHelpSubject = settings.contactHelpSubject;
            }
        }
    };
    return config;
});
