define(function(require) {
    'use strict';

    var module = require('module');
    var masterConfig = module.config();
    var _apiUrl = masterConfig.apiUrl || '';
    var _siteRoot = masterConfig.siteRoot || '';
    var _myPersonnelId = masterConfig.myPersonnelId || '';
    var _expirationThreshold = masterConfig.expirationThreshold || 30;
    var _distanceThreshold = masterConfig.distanceThreshold || 50;
    var _searchResultsThreshold = masterConfig.searchResultsThreshold || 20;
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
        distanceThreshold: function() {
            return _distanceThreshold;
        },
        searchResultsThreshold: function() {
            return _searchResultsThreshold;
        },
        contactHelpEmailAddress: function() {
            return _contactHelpEmailAddress;
        },
        contactHelpSubject: function() {
            return _contactHelpSubject;
        },
        myPersonnelId: function(){
            return _myPersonnelId;
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
