'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

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
        this.resolveDependencies();
        this.renderShellView();
        this.contentViewEl = this.shellView.contentViewEl();
    },
    resolveDependencies: function () {
        //services
        this.geoLocationService = new GeoLocationService();

        //repositories
        this.settingsRepository = new SettingsRepository();
        this.stationRepository = new StationRepository();
        this.personnelRepository = new PersonnelRepository();
        this.stationEntryLogRepository = new StationEntryLogRepository();
        this.warningRepository = new WarningRepository();
        this.abnormalConditionRepository = new AbnormalConditionRepository();
        this.lookupDataItemRepository = new LookupDataItemRepository();

        //mappers
        this.mapper = new ModelMapper();

        //contexts
        this.persistenceContext = new PersistenceContext({
            settingsRepository: this.settingsRepository,
            stationRepository: this.stationRepository,
            personnelRepository: this.personnelRepository,
            stationEntryLogRepository: this.stationEntryLogRepository,
            warningRepository: this.warningRepository,
            abnormalConditionRepository: this.abnormalConditionRepository,
            lookupDataItemRepository: this.lookupDataItemRepository,
            mapper: this.mapper
        });

        //dispatchers
        this.dispatcher = new EventDispatcher();

        //controllers
        this.coreController = new CoreController({
            router: this,
            dispatcher: this.dispatcher,
            geoLocationService: this.geoLocationService,
            persistenceContext: this.persistenceContext
        });
        this.stationViewController = new StationViewController({
            router: this,
            dispatcher: this.dispatcher,
            geoLocationService: this.geoLocationService,
            persistenceContext: this.persistenceContext
        });
        this.personnelViewController = new PersonnelViewController({
            router: this,
            dispatcher: this.dispatcher,
            geoLocationService: this.geoLocationService,
            persistenceContext: this.persistenceContext
        });
        this.stationEntryLogViewController = new StationEntryLogViewController({
            router: this,
            dispatcher: this.dispatcher,
            geoLocationService: this.geoLocationService,
            persistenceContext: this.persistenceContext
        });
    },
    renderShellView: function () {
        this.shellView = new ShellView({
            dispatcher: this.dispatcher
        });
        this.shellView.render();
        $('body').prepend(this.shellView.el);
    },
    routes: {
        '': 'goToStationSearch',
        'station': 'goToStationSearch',
        'station/:stationId': 'goToStationDetails',
        'station/adhoc/:stationEntryLogId': 'goToAdHocStationDetails',
        'station/checkin/:stationId': 'goToCheckIn',
        'entry/edit/:stationId': 'goToEditCheckIn',
        'entry/checkout/:stationId': 'goToCheckOut',
        'personnel': 'goToPersonnelSearch',
        'personnel/:personnelId': 'goToPersonnelDetails'
    },
    goToStationSearch: function () {
        console.trace('appRouter.goToStationSearch');
        this.stationViewController.goToStationSearch();
    },
    goToStationDetails: function (stationId) {
        console.trace('appRouter.goToStationDetails');
        var idRegex = /^\d+$/;
        if (idRegex.test(stationId)) {
            this.stationViewController.goToStationDetails(parseInt(stationId, 10));
        } else {
            this.stationViewController.goToStationDetails(stationId);
        }
    },
    goToAdHocStationDetails: function (stationEntryLogId) {
        console.trace('appRouter.goToAdHocStationDetails');
        var idRegex = /^\d+$/;
        if (idRegex.test(stationEntryLogId)) {
            this.stationViewController.goToAdHocStationDetails(parseInt(stationEntryLogId, 10));
        }
    },
    goToCheckIn: function (stationId) {
        console.trace('appRouter.goToCheckIn');
        var idRegex = /^\d+$/;
        if (idRegex.test(stationId)) {
            this.stationEntryLogViewController.goToCheckIn(parseInt(stationId, 10));
        } else {
            this.stationEntryLogViewController.goToCheckIn(stationId);
        }
    },
    goToEditCheckIn: function (stationEntryLogId) {
        console.trace('appRouter.goToEditCheckIn');
        this.stationEntryLogViewController.goToEditCheckIn(parseInt(stationEntryLogId, 10));
    },
    goToCheckOut: function (stationEntryLogId) {
        console.trace('appRouter.goToCheckOut');
        this.stationEntryLogViewController.goToCheckOut(parseInt(stationEntryLogId, 10));
    },
    goToPersonnelSearch: function () {
        console.trace('appRouter.goToPersonnelSearch');
        this.personnelViewController.goToPersonnelSearch();
    },
    goToPersonnelDetails: function (personnelId) {
        console.trace('appRouter.goToPersonnelDetails');
        this.personnelViewController.goToPersonnelDetails(personnelId);
    },
    navigate: function (fragment, options) {
        SwappingRouter.prototype.navigate.call(this, fragment, options);
        this.trigger('after-navigate', fragment, options);
    }
});

module.exports = CoreRouter;