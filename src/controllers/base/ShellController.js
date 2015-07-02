define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            env = require('env'),
            globals = require('globals'),
            StationEntryLogModel = require('models/StationEntryModel'),
            cicoEvents = require('cico-events');

    /**
     * Creates a new ShellController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var ShellController = function(options) {
        console.debug('new ShellController()');
        options || (options = {});
        this.router = options.router;
        this.titleBarView = options.titleBarView;
        this.footerView = options.footerView;
        this.progressView = options.progressView;
        this.errorView = options.errorView;
        this.confirmationView = options.confirmationView;
        this.loginView = options.loginView;
        this.warningView = options.warningView;
        this.myPersonnelModel = options.myPersonnelModel;

        this.initialize.apply(this, arguments);

        this.listenTo(cicoEvents, cicoEvents.showErrorView, this.showErrorView);
    };

    _.extend(ShellController.prototype, Backbone.Events, {
        /** @class ShellController
         * @contructs ShellController object
         * @param {object} options
         */
        initialize: function(options) {
            console.debug('ShellController.initialize');
            options = (options || {});
            _.bindAll(this, '_logoutOfApp', '_logoutOfServer');
        },
        /** Navigates to the station search
         */
        goToStationSearch: function() {
            console.debug('ShellController.goToStationSearch');
            var currentContext = this;
            currentContext.router.navigate('station', {trigger: true});
        },
        /** Navigates to the personnel search
         */
        goToPersonnelSearch: function() {
            console.debug('ShellController.goToPersonnelSearch');
            var currentContext = this;
            currentContext.router.navigate('personnel', {trigger: true});
        },
        goToDirectionsLatLon: function(latitude, longitude) {
            var directionsUriOptions = env.getDirectionsUri(latitude, longitude);
            if (directionsUriOptions.useNative) {
                globals.window.location.href = directionsUriOptions.uri;
            } else {
                globals.window.open(directionsUriOptions.uri);
            }
        },
        getStationEntryLogs: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/stationEntryLog/find/open'
            });
        },
        refreshOpenStationEntryLogs: function() {
            var currentContext = this;
            $.when(currentContext.getStationEntryLogs()).done(function(getStationEntryLogsResponse) {
                if (getStationEntryLogsResponse && getStationEntryLogsResponse.stationEntryLogs && getStationEntryLogsResponse.stationEntryLogs.length > 0) {
                    var openStationEntryLog = new StationEntryLogModel(getStationEntryLogsResponse.stationEntryLogs[0]);
                    currentContext.setCheckedInStation(openStationEntryLog);
                } else {
                    currentContext.setCheckedInStation();
                }
            });
        },
        setCheckedInStation: function(openStationEntryLogModel) {
            cicoEvents.trigger('currentCheckedInChange', openStationEntryLogModel);
            if (openStationEntryLogModel) {
                var stationId = openStationEntryLogModel.get('stationId');
                if (stationId) {
                    openStationEntryLogModel.trigger('durationExpiredMax');
                    if (openStationEntryLogModel.durationExpiredMax()) {
                        if (!openStationEntryLogModel.durationExpiredMaxShown) {
                            openStationEntryLogModel.durationExpiredMaxShown = true;
                            openStationEntryLogModel.trigger('durationExpiredMax');
                        }
                    } else if (openStationEntryLogModel.durationExpired()) {
                        if (!this.myPersonnelModel.get('durationExpiredShown')) {
                            this.showWarningView('Your expected check out time has passed. Please check out or extend duration.');
                            this.myPersonnelModel.attributes.durationExpiredShown = true;
                        }
                    }
                }
            }
        },
        /** Updates the title bar view
         * @param {object} options
         */
        setTitleBarOptions: function(options) {
            console.debug('ShellController.setTitleBarOptions');
            options || (options = {});
            var titleBarOptions = $.extend(this.titleBarView.getDefaultsForRendering(), options);
            titleBarOptions.title = env.getAppTitle();
            this.titleBarView.updateViewFromModel(titleBarOptions);
        },
        /** Updates the footer view
         * @param {string} footerCopy
         */
        setFooterCopy: function(footerCopy) {
            console.debug('ShellController.setFooterCopy');
            this.footerView.setFooterCopy(footerCopy);
        },
        /** Shows the error view
         * @param {string} errorMessage
         */
        showErrorView: function(errorMessage) {
            console.debug('ShellController.showErrorView');
            this.errorView.show(errorMessage);
        },
        /** Shows the warning view
         * @param {string} warningMessage
         */
        showWarningView: function(warningMessage) {
            console.debug('ShellController.showWarningView');
            this.warningView.show(warningMessage);
        },
        /** Shows the confirmation view
         * @param {string} confirmationMessage
         * @param {string} confirmationType
         */
        showConfirmationView: function(confirmationMessage, confirmationType) {
            console.debug('ShellController.showConfirmationView');
            this.confirmationView.show(confirmationMessage, confirmationType);
        },
        /** Shows the login view
         * @param {callback} afterLoginHandler
         */
        showLoginView: function(afterLoginHandler) {
            console.debug('ShellController.showLoginView');
            var currentContext = this;
            var loginSyncHandler = function() {
                currentContext.loginView.hide();
                afterLoginHandler();
            };
            this.loginView.model.once('sync', loginSyncHandler);
            this.loginView.show();
        },
        /** Navigates to the logout
         */
        logout: function() {
            console.debug('ShellController.logout');
            var deferred = $.Deferred();
            this.router.trigger('logout');
            var url = env.getSiteRoot() + "?ts=" + (new Date()).getTime();

            $.when(this._logoutOfApp(), this._logoutOfServer()).then(
                    function() {
                        globals.window.location.href = url;
                        deferred.resolve(url);
                    },
                    function() {
                        deferred.reject();
                    });

            return deferred.promise();
        },
        /** Open the help file
         */
        openHelp: function() {
            globals.window.open("docs/CicoHelp.html");
        },
        /** Email the help file
         */
        emailHelp: function() {
            var bodyLine = "%0D%0A";
            var seperator = "------------------------------------------";
            var email = env.getHelpEmail();
            var subject = env.getHelpEmailSubject();

            var firstName = '';
            var lastName = '';
            var middleName = '';
            var userEmail = "Email: ";
            var contactNumber = "Contact Number: ";
            var userName = "User Name: ";

            if (this.appDataModel) {
                if (this.appDataModel.get("userInfo")) {
                    firstName = this.appDataModel.get("userInfo").firstName;
                    lastName = this.appDataModel.get("userInfo").lastName;
                    middleName = (this.appDataModel.get("userInfo").middleName ? this.appDataModel.get("userInfo").middleName : '');
                    userEmail = userEmail + this.appDataModel.get("userInfo").email;
                    userName = userName + firstName + " " + middleName + " " + lastName;
                }
                contactNumber = contactNumber + (this.appDataModel.get("contactNumber") ? this.appDataModel.get("contactNumber") : '');
            }

            globals.window.location.href = "mailto:" + email + "?subject=" + subject + "&body=" + userName + bodyLine + userEmail + bodyLine + contactNumber + bodyLine + seperator + bodyLine + bodyLine + "message%20goes%20here";
        },
        /** Posts a get to the App Logout Url
         */
        _logoutOfApp: function() {
            return $.get(env.getAppLogoutUrl());
        },
        /** Posts a get to the Logout Url
         */
        _logoutOfServer: function() {
            return $.get(env.getLogoutUrl());
        }
    });

    return ShellController;
});