define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            SwappingRouter = require('routers/base/SwappingRouter'),
            ShellView = require('views/ShellView'),
            TitleBarView = require('views/TitleBarView'),
            FooterView = require('views/FooterView'),
            ProgressView = require('views/ProgressView'),
            ErrorView = require('views/ErrorView'),
            ConfirmationView = require('views/ConfirmationView'),
            LoginView = require('views/LoginView'),
            WarningView = require('views/WarningView'),
            AuthModel = require('models/AuthModel'),
            StationController = require('controllers/StationController'),
            PersonnelController = require('controllers/PersonnelController'),
            PersonnelModel = require('models/PersonnelModel'),
            env = require('env'),
            setupAuthRetry = require('auth-retry-setup');

    var AppRouter = SwappingRouter.extend({
        getSettings: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/lookupDataItem/find/settings'
            });
        },
        getPersonnels: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/personnel/find/me'
            });
        },
        /** @class AppRouter
         * @contructs AppRouter object
         * @param {object} options
         */
        initialize: function(options) {
            console.debug('appRouter.initialize');
            options || (options = {});
            var currentContext = this;
            var shellViewInstance = new ShellView({
                el: $('body'),
                titleBarView: new TitleBarView({
                    id: 'titleBarView',
                    title: env.getAppTitle()
                }),
                footerView: new FooterView({
                    id: 'footerView',
                    footerCopy: ''
                }),
                progressView: new ProgressView({
                    id: 'progressView'
                }),
                errorView: new ErrorView({
                    id: 'errorView'
                }),
                confirmationView: new ConfirmationView({
                    id: 'confirmationView'
                }),
                loginView: new LoginView({
                    id: 'loginView',
                    model: new AuthModel()
                }),
                warningView: new WarningView({
                    id: 'warningView'
                })
            });
            shellViewInstance.render();
            currentContext.contentViewEl = shellViewInstance.contentViewEl();

            $.when(currentContext.getSettings()).done(function(getSettingsResponse) {
                env.overrideConfig(getSettingsResponse);
            });

            currentContext.myPersonnelModel = new PersonnelModel();
            

            var controllerOptions = {};
            controllerOptions.router = currentContext;
            controllerOptions.myPersonnelModel = currentContext.myPersonnelModel;
            controllerOptions.titleBarView = shellViewInstance.titleBarView();
            controllerOptions.footerView = shellViewInstance.footerView();
            controllerOptions.progressView = shellViewInstance.progressView();
            controllerOptions.errorView = shellViewInstance.errorView();
            controllerOptions.warningView = shellViewInstance.warningView();
            controllerOptions.confirmationView = shellViewInstance.confirmationView();
            controllerOptions.loginView = shellViewInstance.loginView();

            currentContext.stationControllerInstance = new StationController(controllerOptions);
            currentContext.personnelControllerInstance = new PersonnelController(controllerOptions);
            currentContext.stationControllerInstance.checkDurationExpiredEveryMinute();
            
            $.when(currentContext.getPersonnels()).done(function(getPersonnelsResponse) {
                if (getPersonnelsResponse && getPersonnelsResponse.personnels && getPersonnelsResponse.personnels.length > 0) {
                    currentContext.myPersonnelModel.set(getPersonnelsResponse.personnels[0]);
                    currentContext.stationControllerInstance.refreshOpenStationEntryLogs();
                }
            });

            shellViewInstance.footerView().controller = currentContext.stationControllerInstance;

            setupAuthRetry(function(afterLoginCallback) {
                currentContext.stationControllerInstance.showLoginView(afterLoginCallback);
            });
            currentContext.on('logout', currentContext._clearLocalStorage);
        },
        /** Route fragment handler mappings
         */
        routes: {
            '': 'stationSearch',
            'station': 'stationSearch',
            'station/:id': 'station',
            'personnel': 'personnelSearch',
            'personnel/outsideid/:id': 'personnelByOutsideId',
            'personnel/username/:name': 'personnelByName',
            'entry/adhoc/:id': 'adHocLanding'
        },
        /** Navigates to the station search
         */
        stationSearch: function() {
            console.debug('appRouter.stationSearch');
            this.stationControllerInstance.goToStationList();
        },
        /** Navigates to the station view
         * @param {string} id
         */
        station: function(id) {
            console.debug('appRouter.station');
            var idRegex = /^\d+$/;
            if (idRegex.test(id)) {
                this.stationControllerInstance.goToStationWithId(parseInt(id, 10));
            } else {
                this.stationControllerInstance.goToStationWithId(id);
            }
        },
        /** Navigates to the personnel search
         */
        personnelSearch: function() {
            console.debug('appRouter.personnelSearch');
            this.personnelControllerInstance.goToPersonnelList();
        },
        /** Navigates to the personnel view
         * @param {string} id
         */
        personnelByOutsideId: function(id) {
            console.debug('appRouter.personnelByOutsideId');
            this.personnelControllerInstance.goToPersonnelWithId(id);
        },
        /** Navigates to the personnel view
         * @param {string} name
         */
        personnelByName: function(name) {
            console.debug('appRouter.personnelByName');
            this.personnelControllerInstance.goToPersonnelWithName(name);
        },
        /** Navigates to the ad hoc landing view
         * @param {string} id
         */
        adHocLanding: function(id) {
            this.stationControllerInstance.goToAdHocLanding(id);
        },
        /** Simple proxy to Backbone.history to save a fragment into the history
         * @param {object} fragment
         * @param {object} options
         */
        navigate: function(fragment, options) {
            SwappingRouter.prototype.navigate.call(this, fragment, options);
            this.trigger('after-navigate', fragment, options);
        },
        /** Simple proxy to clear Backbone.localStorage
         */
        _clearLocalStorage: function() {
            if (this.stationControllerInstance) {
                this.stationControllerInstance._clearLocalStorage();
            }
            if (this.personnelControllerInstance) {
                this.personnelControllerInstance._clearLocalStorage();
            }
        }
    });

    return new AppRouter();
});