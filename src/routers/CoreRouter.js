define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var SwappingRouter = require('routers/SwappingRouter');
    var ShellView = require('views/ShellView');
    var PersistenceContext = require('contexts/PersistenceContext');
    var SettingsRepository = require('repositories/SettingsRepository');
    var StationRepository = require('repositories/StationRepository');
    var PersonnelRepository = require('repositories/PersonnelRepository');
    var StationEntryLogRepository = require('repositories/StationEntryLogRepository');
    var WarningRepository = require('repositories/WarningRepository');
    var AbnormalConditionRepository = require('repositories/AbnormalConditionRepository');
    var LookupDataItemRepository = require('repositories/LookupDataItemRepository');
    var ModelMapper = require('mappers/ModelMapper');
    var CoreController = require('controllers/CoreController');
    var StationViewController = require('controllers/StationViewController');
    var PersonnelViewController = require('controllers/PersonnelViewController');
    var StationEntryLogViewController = require('controllers/StationEntryLogViewController');
    var GeoLocationService = require('services/GeoLocationService');
    var EventDispatcher = require('dispatchers/EventDispatcher');

    var CoreRouter = SwappingRouter.extend({
        initialize: function (options) {
            console.trace('appRouter.initialize');
            options || (options = {});
            var currentContext = this;
            currentContext.resolveDependencies();
            currentContext.renderShellView();
            currentContext.contentViewEl = currentContext.shellView.contentViewEl();
            currentContext.modalViewEl = currentContext.shellView.modalViewEl();
        },
        resolveDependencies: function () {
            var currentContext = this;

            //services
            currentContext.geoLocationService = new GeoLocationService();

            //repositories
            currentContext.settingsRepository = new SettingsRepository();
            currentContext.stationRepository = new StationRepository();
            currentContext.personnelRepository = new PersonnelRepository();
            currentContext.stationEntryLogRepository = new StationEntryLogRepository();
            currentContext.warningRepository = new WarningRepository();
            currentContext.abnormalConditionRepository = new AbnormalConditionRepository();
            currentContext.lookupDataItemRepository = new LookupDataItemRepository();

            //mappers
            currentContext.mapper = new ModelMapper();

            //contexts
            currentContext.persistenceContext = new PersistenceContext({
                geoLocationService: currentContext.geoLocationService,
                settingsRepository: currentContext.settingsRepository,
                stationRepository: currentContext.stationRepository,
                personnelRepository: currentContext.personnelRepository,
                stationEntryLogRepository: currentContext.stationEntryLogRepository,
                warningRepository: currentContext.warningRepository,
                abnormalConditionRepository: currentContext.abnormalConditionRepository,
                lookupDataItemRepository: currentContext.lookupDataItemRepository,
                mapper: currentContext.mapper
            });

            //dispatchers
            currentContext.dispatcher = new EventDispatcher();

            //controllers
            currentContext.coreController = new CoreController({
                router: currentContext,
                dispatcher: currentContext.dispatcher
            });
            currentContext.stationViewController = new StationViewController({
                router: currentContext,
                dispatcher: currentContext.dispatcher,
                geoLocationService: currentContext.geoLocationService,
                persistenceContext: currentContext.persistenceContext
            });
            currentContext.personnelViewController = new PersonnelViewController({
                router: currentContext,
                dispatcher: currentContext.dispatcher,
                geoLocationService: currentContext.geoLocationService,
                persistenceContext: currentContext.persistenceContext
            });
            currentContext.stationEntryLogViewController = new StationEntryLogViewController({
                router: currentContext,
                dispatcher: currentContext.dispatcher,
                geoLocationService: currentContext.geoLocationService,
                persistenceContext: currentContext.persistenceContext
            });
        },
        renderShellView: function () {
            var currentContext = this;
            currentContext.shellView = new ShellView({
                dispatcher: currentContext.dispatcher
            });
            currentContext.shellView.render();
            $('body').prepend(currentContext.shellView.el);
        },
        routes: {
            '': 'goToStationSearch',
            'station': 'goToStationSearch',
            'station/:stationId': 'goToStationDetailWithId',
            'station/adhoc/:stationEntryLogId': 'goToAdHocStationWithId',
            'personnel': 'goToPersonnelSearch',
            'personnel/outsideid/:outsideId': 'goToPersonnelDetailWithId',
            'personnel/username/:userName': 'goToPersonnelDetailWithUserName'
        },
        goToStationSearch: function () {
            console.trace('appRouter.goToStationSearch');
            this.stationViewController.goToStationSearch();
        },
        goToStationDetailWithId: function (stationId) {
            console.trace('appRouter.goToStationDetailWithId');
            var idRegex = /^\d+$/;
            if (idRegex.test(stationId)) {
                this.stationViewController.goToStationDetailWithId(parseInt(stationId, 10));
            } else {
                this.stationViewController.goToStationDetailWithId(stationId);
            }
        },
        goToAdHocStationWithId: function (stationEntryLogId) {
            console.trace('appRouter.goToAdHocStationWithId');
            var idRegex = /^\d+$/;
            if (idRegex.test(stationEntryLogId)) {
                this.stationViewController.goToAdHocStationWithId(parseInt(stationEntryLogId, 10));
            }
        },
        goToPersonnelSearch: function () {
            console.trace('appRouter.goToPersonnelSearch');
            this.personnelViewController.goToPersonnelSearch();
        },
        goToPersonnelDetailWithId: function (outsideId) {
            console.trace('appRouter.goToPersonnelDetailWithId');
            this.personnelViewController.goToPersonnelDetailWithId(outsideId);
        },
        goToPersonnelDetailWithUserName: function (userName) {
            console.trace('appRouter.goToPersonnelDetailWithUserName');
            this.personnelViewController.goToPersonnelDetailWithUserName(userName);
        },
        navigate: function (fragment, options) {
            SwappingRouter.prototype.navigate.call(this, fragment, options);
            this.trigger('after-navigate', fragment, options);
        }
    });

    return CoreRouter;
});