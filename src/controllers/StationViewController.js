'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var StationModel = require('models/StationModel');
var PersonnelModel = require('models/PersonnelModel');
var StationEntryLogModel = require('models/StationEntryLogModel');
var StationSearchView = require('views/StationSearchView');
var StationDetailView = require('views/StationDetailView');
var AdHocStationDetailView = require('views/AdHocStationDetailView');
var EventNameEnum = require('enums/EventNameEnum');
var StationTypeEnum = require('enums/StationTypeEnum');
var CheckInTypeEnum = require('enums/CheckInTypeEnum');

var StationController = function (options) {
    this.initialize.apply(this, arguments);
};

_.extend(StationController.prototype, Backbone.Events, {

    initialize: function (options) {
        console.trace('StationController.initialize');
        options || (options = {});
        this.router = options.router;
        this.dispatcher = options.dispatcher;
        this.geoLocationService = options.geoLocationService;
        this.persistenceContext = options.persistenceContext;
        this.mapper = options.mapper;

        this.listenTo(this.dispatcher, EventNameEnum.goToStationSearch, this.goToStationSearch);
        this.listenTo(this.dispatcher, EventNameEnum.goToStationDetails, this.goToStationDetails);
        this.listenTo(this.dispatcher, EventNameEnum.goToAdHocStationDetails, this.goToAdHocStationDetails);
        this.listenTo(this.dispatcher, EventNameEnum.getNearbyStations, this.getNearbyStations);
        this.listenTo(this.dispatcher, EventNameEnum.getRecentStations, this.getRecentStations);
        this.listenTo(this.dispatcher, EventNameEnum.getStationsByStationName, this.getStationsByStationName);
        this.listenTo(this.dispatcher, EventNameEnum.getAbnormalConditions, this.getAbnormalConditions);
        this.listenTo(this.dispatcher, EventNameEnum.getWarnings, this.getWarnings);

        this.thresholds = {
            distanceThreshold: 50,
            resultCountThreshold: 20
        };
    },

    goToStationSearch: function () {
        var self = this;
        var deferred = $.Deferred();
        var myPersonnelModel = new PersonnelModel();
        var myOpenStationEntryLogModel = new StationEntryLogModel();
        var stationSearchView = new StationSearchView({
            dispatcher: self.dispatcher,
            myPersonnelModel: myPersonnelModel,
            myOpenStationEntryLogModel: myOpenStationEntryLogModel
        });

        self.router.swapContent(stationSearchView);
        self.router.navigate('station');

        $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog())
            .done(function (myPersonnelData, myOpenStationEntryLogData) {
                myPersonnelModel.set(myPersonnelData);
                myOpenStationEntryLogModel.set(myOpenStationEntryLogData);
                self.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel, myOpenStationEntryLogModel);
                stationSearchView.trigger('loaded');
                deferred.resolve(stationSearchView);
            })
            .fail(function (error) {
                stationSearchView.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    goToStationDetails: function (stationId) {
        var self = this;
        var deferred = $.Deferred();
        var myPersonnelModel = new PersonnelModel();
        var myOpenStationEntryLogModel = new StationEntryLogModel();
        var stationModel = new StationModel();
        var stationDetailView = new StationDetailView({
            dispatcher: self.dispatcher,
            model: stationModel,
            myPersonnelModel: myPersonnelModel,
            myOpenStationEntryLogModel: myOpenStationEntryLogModel
        });

        self.router.swapContent(stationDetailView);
        self.router.navigate('station/' + stationId);

        $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog(), self.persistenceContext.getStation({stationId: stationId}))
            .done(function (myPersonnelData, myOpenStationEntryLogData, stationData) {
                myPersonnelModel.set(myPersonnelData);
                myOpenStationEntryLogModel.set(myOpenStationEntryLogData);
                self.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel, myOpenStationEntryLogModel);
                stationModel.set(stationData);
                stationDetailView.trigger('loaded');
                deferred.resolve(stationDetailView);
            })
            .fail(function (error) {
                stationDetailView.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    goToAdHocStationDetails: function (stationEntryLogId) {
        var self = this;
        var deferred = $.Deferred();
        var myPersonnelModel = new PersonnelModel();
        var myOpenStationEntryLogModel = new StationEntryLogModel();
        var stationEntryLogModel = new StationEntryLogModel();
        var adHocStationView = new AdHocStationDetailView({
            dispatcher: self.dispatcher,
            model: stationEntryLogModel,
            myPersonnelModel: myPersonnelModel,
            myOpenStationEntryLogModel: myOpenStationEntryLogModel
        });

        self.router.swapContent(adHocStationView);
        self.router.navigate('station/adhoc/' + stationEntryLogId);

        $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog(), self.persistenceContext.getStationEntryLog({stationEntryLogId: stationEntryLogId}))
            .done(function (myPersonnelData, myOpenStationEntryLogData, stationEntryLogData) {
                myPersonnelModel.set(myPersonnelData);
                myOpenStationEntryLogModel.set(myOpenStationEntryLogData);
                self.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel, myOpenStationEntryLogModel);
                stationEntryLogModel.set(stationEntryLogData);
                adHocStationView.trigger('loaded');
                deferred.resolve(adHocStationView);
            })
            .fail(function (error) {
                adHocStationView.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getNearbyStations: function (stationCollection, options) {
        var self = this;
        var deferred = $.Deferred();
        self.geoLocationService.getCurrentPosition()
            .done(function (position) {
                var _options = _.extend({}, position.coords, options, self.thresholds);
                self.persistenceContext.getNearbyStations(_options)
                    .done(function (stationsData) {
                        stationCollection.reset(stationsData);
                        deferred.resolve(stationCollection);
                    })
                    .fail(function (error) {
                        stationCollection.trigger('error', error);
                        deferred.reject(error);
                    });
            })
            .fail(function (getCurrentPositionError) {
                stationCollection.trigger('error', getCurrentPositionError);
                deferred.reject(getCurrentPositionError);
            });

        return deferred.promise();
    },

    getRecentStations: function (stationCollection, options) {
        var self = this;
        var deferred = $.Deferred();
        var _options = _.extend({}, options, self.thresholds);
        self.persistenceContext.getRecentStations(_options)
            .done(function (stationsData) {
                stationCollection.reset(stationsData);
                deferred.resolve(stationCollection);
            })
            .fail(function (error) {
                stationCollection.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getStations: function (stationCollection, options) {
        var self = this;
        var deferred = $.Deferred();
        var _options = _.extend({}, options, self.thresholds);
        self.persistenceContext.getStations(_options)
            .done(function (stationsData) {
                stationCollection.reset(stationsData);
                deferred.resolve(stationCollection);
            })
            .fail(function (error) {
                stationCollection.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getAbnormalConditions: function (abnormalConditionCollection, options) {
        var self = this;
        var deferred = $.Deferred();
        self.persistenceContext.getAbnormalConditions(options)
            .done(function (abnormalConditionsData) {
                abnormalConditionCollection.reset(abnormalConditionsData);
                deferred.resolve(abnormalConditionCollection);
            })
            .fail(function (error) {
                abnormalConditionCollection.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getWarnings: function (warningCollection, options) {
        var self = this;
        var deferred = $.Deferred();
        self.persistenceContext.getWarnings(options)
            .done(function (warningsData) {
                warningCollection.reset(warningsData);
                deferred.resolve(warningCollection);
            })
            .fail(function (error) {
                warningCollection.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    addWarning: function (warningModel) {
        var self = this;
        var deferred = $.Deferred();
        $.when(self.persistenceContext.addWarning(warningModel.attributes))
            .done(function (warningData) {
                warningModel.set(warningData);
                self.dispatcher.trigger(EventNameEnum.addWarningSuccess, warningModel);
                deferred.resolve(warningModel);
            }).fail(function (error) {
                self.dispatcher.trigger(EventNameEnum.addWarningError, error);
                deferred.reject('error');
            });

        return deferred.promise();
    },

    clearWarning: function (warningModel) {
        var self = this;
        var deferred = $.Deferred();
        $.when(self.persistenceContext.clearWarning(warningModel.attributes))
            .done(function (warningData) {
                warningModel.set(warningData);
                self.dispatcher.trigger(EventNameEnum.clearWarningSuccess, warningModel);
                deferred.resolve(warningModel);
            }).fail(function (error) {
                self.dispatcher.trigger(EventNameEnum.clearWarningError, error);
                deferred.reject('error');
            });

        return deferred.promise();
    }

});

module.exports = StationController;