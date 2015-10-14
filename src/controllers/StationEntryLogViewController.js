'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var StationModel = require('models/StationModel');
var PersonnelModel = require('models/PersonnelModel');
var StationEntryLogModel = require('models/StationEntryLogModel');
var AdHocCheckInView = require('views/AdHocCheckInView');
var CheckInView = require('views/CheckInView');
var EditCheckInView = require('views/EditCheckInView');
var CheckOutView = require('views/CheckOutView');
var EventNameEnum = require('enums/EventNameEnum');
var CheckInTypeEnum = require('enums/CheckInTypeEnum');

var StationEntryLogViewController = function (options) {
    this.initialize.apply(this, arguments);
};

_.extend(StationEntryLogViewController.prototype, Backbone.Events, {

    initialize: function (options) {
        console.trace('StationEntryLogViewController.initialize');
        options || (options = {});
        this.router = options.router;
        this.dispatcher = options.dispatcher;
        this.geoLocationService = options.geoLocationService;
        this.persistenceContext = options.persistenceContext;

        this.listenTo(this.dispatcher, EventNameEnum.getNearbyStationEntryLogs, this.getNearbyStationEntryLogs);
        this.listenTo(this.dispatcher, EventNameEnum.getOpenStationEntryLogs, this.getOpenStationEntryLogs);
        this.listenTo(this.dispatcher, EventNameEnum.getRecentStationEntryLogs, this.getRecentStationEntryLogs);
        this.listenTo(this.dispatcher, EventNameEnum.goToAdHocStationDetails, this.goToAdHocStationDetails);
        this.listenTo(this.dispatcher, EventNameEnum.goToCheckIn, this.goToCheckIn);
        this.listenTo(this.dispatcher, EventNameEnum.goToAdHocCheckIn, this.goToAdHocCheckIn);
        this.listenTo(this.dispatcher, EventNameEnum.checkIn, this.checkIn);
        this.listenTo(this.dispatcher, EventNameEnum.goToEditCheckIn, this.goToEditCheckIn);
        this.listenTo(this.dispatcher, EventNameEnum.editCheckIn, this.editCheckIn);
        this.listenTo(this.dispatcher, EventNameEnum.goToCheckOut, this.goToCheckOut);
        this.listenTo(this.dispatcher, EventNameEnum.checkOut, this.checkOut);

        this.thresholds = {
            distanceThreshold: 50,
            resultCountThreshold: 20
        };
    },

    getNearbyStationEntryLogs: function (stationEntryLogCollection, options) {
        var self = this;
        var deferred = $.Deferred();
        self.geoLocationService.getCurrentPosition()
            .done(function (position) {
                var _options = _.extend({}, position.coords, options, self.thresholds);
                self.persistenceContext.getNearbyStationEntryLogs(_options)
                    .done(function (stationEntryLogsData) {
                        stationEntryLogCollection.reset(stationEntryLogsData);
                        deferred.resolve(stationEntryLogCollection);
                    })
                    .fail(function (error) {
                        stationEntryLogCollection.trigger('error', error);
                        deferred.reject(error);
                    });
            })
            .fail(function (getCurrentPositionError) {
                stationEntryLogCollection.trigger('error', getCurrentPositionError);
                deferred.reject(getCurrentPositionError);
            });

        return deferred.promise();
    },

    getOpenStationEntryLogs: function (stationEntryLogCollection, options) {
        var self = this;
        var deferred = $.Deferred();
        self.persistenceContext.getOpenStationEntryLogs(options)
            .done(function (stationEntryLogsData) {
                stationEntryLogCollection.reset(stationEntryLogsData);
                deferred.resolve(stationEntryLogCollection);
            })
            .fail(function (error) {
                stationEntryLogCollection.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getRecentStationEntryLogs: function (stationEntryLogCollection, options) {
        var self = this;
        var deferred = $.Deferred();
        self.persistenceContext.getRecentStationEntryLogs(options)
            .done(function (stationEntryLogsData) {
                stationEntryLogCollection.reset(stationEntryLogsData);
                deferred.resolve(stationEntryLogCollection);
            })
            .fail(function (error) {
                stationEntryLogCollection.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    goToCheckIn: function (stationId) {
        var self = this;
        var deferred = $.Deferred();
        var myPersonnelModel = new PersonnelModel();
        var myOpenStationEntryLogModel = new StationEntryLogModel();
        var stationEntryLogModel = new StationEntryLogModel({
            checkInType: CheckInTypeEnum.station
        });
        var stationModel = new StationModel();
        var purposeCollection = new Backbone.Collection();
        var durationCollection = new Backbone.Collection();
        var checkInView = new CheckInView({
            dispatcher: self.dispatcher,
            myPersonnelModel: myPersonnelModel,
            myOpenStationEntryLogModel: myOpenStationEntryLogModel,
            model: stationEntryLogModel,
            stationModel: stationModel,
            purposeCollection: purposeCollection,
            durationCollection: durationCollection
        });

        self.router.swapContent(checkInView);
        self.router.navigate('station/checkin/' + stationId.toString());

        $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog(), self.persistenceContext.getStation({stationId: stationId}), self.persistenceContext.getOptions())
            .done(function (myPersonnelData, myOpenStationEntryLogData, stationData, optionsData) {
                myPersonnelModel.set(myPersonnelData);
                myOpenStationEntryLogModel.set(myOpenStationEntryLogData);
                self.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel, myOpenStationEntryLogModel);
                stationModel.set(stationData);
                purposeCollection.reset(optionsData.purposes);
                durationCollection.reset(optionsData.durations);
                checkInView.trigger('loaded');
                deferred.resolve(checkInView);
            })
            .fail(function (error) {
                checkInView.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    goToAdHocCheckIn: function () {
        var self = this;
        var deferred = $.Deferred();
        var myPersonnelModel = new PersonnelModel();
        var myOpenStationEntryLogModel = new StationEntryLogModel();
        var stationEntryLogModel = new StationEntryLogModel({
            checkInType: CheckInTypeEnum.adHoc
        });
        var purposeCollection = new Backbone.Collection();
        var durationCollection = new Backbone.Collection();
        var areaCollection = new Backbone.Collection();
        var adHocCheckInView = new AdHocCheckInView({
            dispatcher: self.dispatcher,
            myPersonnelModel: myPersonnelModel,
            myOpenStationEntryLogModel: myOpenStationEntryLogModel,
            model: stationEntryLogModel,
            purposeCollection: purposeCollection,
            durationCollection: durationCollection,
            areaCollection: areaCollection
        });

        self.router.swapContent(adHocCheckInView);
        self.router.navigate('station/adhoc/checkin');

        $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog(), self.persistenceContext.getOptions())
            .done(function (myPersonnelData, myOpenStationEntryLogData, optionsData) {
                myPersonnelModel.set(myPersonnelData);
                myOpenStationEntryLogModel.set(myOpenStationEntryLogData);
                self.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel, myOpenStationEntryLogModel);
                purposeCollection.reset(optionsData.purposes);
                durationCollection.reset(optionsData.durations);
                areaCollection.reset(optionsData.areas);
                adHocCheckInView.trigger('loaded');
                deferred.resolve(adHocCheckInView);
            })
            .fail(function (error) {
                adHocCheckInView.trigger('error', error);
                deferred.rejectWith(self, [error]);
            });

        self.geoLocationService.getCurrentPosition()
            .done(function (position) {
                adHocCheckInView.updateGpsLabel(position.coords);
            })
            .fail(function (getCurrentPositionError) {
                adHocCheckInView.updateGpsLabel();
            });

        return deferred.promise();
    },

    checkIn: function (stationEntryLogModel) {
        var self = this;
        var deferred = $.Deferred();
        self.persistenceContext.checkIn(stationEntryLogModel.attributes)
            .done(function (stationEntryLog) {
                stationEntryLogModel.set(stationEntryLog);
                self.dispatcher.trigger(EventNameEnum.checkInSuccess, stationEntryLogModel);
                deferred.resolve(stationEntryLogModel);
            })
            .fail(function (error) {
                self.dispatcher.trigger(EventNameEnum.checkInError, error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    goToEditCheckIn: function (stationEntryLogId) {
        var self = this;
        var deferred = $.Deferred();
        var myPersonnelModel = new PersonnelModel();
        var myOpenStationEntryLogModel = new StationEntryLogModel();
        var stationEntryLogModel = new StationEntryLogModel();
        var durationCollection = new Backbone.Collection();
        var editCheckInView = new EditCheckInView({
            dispatcher: self.dispatcher,
            myPersonnelModel: myPersonnelModel,
            myOpenStationEntryLogModel: myOpenStationEntryLogModel,
            model: stationEntryLogModel,
            durationCollection: durationCollection
        });

        self.router.swapContent(editCheckInView);
        self.router.navigate('entry/edit/' + stationEntryLogId.toString());

        $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog(), self.persistenceContext.getStationEntryLog({stationEntryLogId: stationEntryLogId}), self.persistenceContext.getOptions())
            .done(function (myPersonnelData, myOpenStationEntryLogData, stationEntryLogData, optionsData) {
                myPersonnelModel.set(myPersonnelData);
                myOpenStationEntryLogModel.set(myOpenStationEntryLogData);
                self.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel, myOpenStationEntryLogModel);
                stationEntryLogModel.set(stationEntryLogData);
                durationCollection.reset(optionsData.durations);
                var stationId = stationEntryLogModel.get('stationId');
                if (stationId) {
                    self.persistenceContext.getStation(stationId)
                        .done(function (stationData) {
                            editCheckInView.stationModel = new StationModel(stationData);
                            editCheckInView.trigger('loaded');
                            deferred.resolve(editCheckInView);
                        })
                        .fail(function (getStationError) {
                            editCheckInView.trigger('error', getStationError);
                            deferred.reject(getStationError);
                        });
                } else {
                    editCheckInView.trigger('loaded');
                    deferred.resolve(editCheckInView);
                }
            })
            .fail(function (error) {
                editCheckInView.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    editCheckIn: function (stationEntryLogModel) {
        var self = this;
        var deferred = $.Deferred();
        self.persistenceContext.editCheckIn(stationEntryLogModel.attributes)
            .done(function (stationEntryLog) {
                stationEntryLogModel.set(stationEntryLog);
                self.dispatcher.trigger(EventNameEnum.editCheckInSuccess, stationEntryLogModel);
                deferred.resolve(stationEntryLog);
            })
            .fail(function (error) {
                self.dispatcher.trigger(EventNameEnum.editCheckInError, error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    goToCheckOut: function (stationEntryLogId) {
        var self = this;
        var deferred = $.Deferred();
        var myPersonnelModel = new PersonnelModel();
        var myOpenStationEntryLogModel = new StationEntryLogModel();
        var stationEntryLogModel = new StationEntryLogModel();
        var checkOutView = new CheckOutView({
            dispatcher: self.dispatcher,
            myPersonnelModel: myPersonnelModel,
            myOpenStationEntryLogModel: myOpenStationEntryLogModel,
            model: stationEntryLogModel
        });

        self.router.swapContent(checkOutView);
        self.router.navigate('entry/checkout/' + stationEntryLogId.toString());

        $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog(), self.persistenceContext.getStationEntryLog({stationEntryLogId: stationEntryLogId}))
            .done(function (myPersonnelData, myOpenStationEntryLogData, stationEntryLogData) {
                myPersonnelModel.set(myPersonnelData);
                myOpenStationEntryLogModel.set(myOpenStationEntryLogData);
                self.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel, myOpenStationEntryLogModel);
                stationEntryLogModel.set(stationEntryLogData);
                var stationId = stationEntryLogModel.get('stationId');
                if (stationId) {
                    self.persistenceContext.getStation(stationId)
                        .done(function (stationData) {
                            checkOutView.stationModel = new StationModel(stationData);
                            checkOutView.trigger('loaded');
                            deferred.resolve(checkOutView);
                        })
                        .fail(function (getStationError) {
                            checkOutView.trigger('error', getStationError);
                            deferred.reject(getStationError);
                        });
                } else {
                    checkOutView.trigger('loaded');
                    deferred.resolve(checkOutView);
                }
            })
            .fail(function (error) {
                checkOutView.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    checkOut: function (stationEntryLogModel) {
        var self = this;
        var deferred = $.Deferred();
        self.persistenceContext.checkOut(stationEntryLogModel.attributes)
            .done(function (stationEntryLogData) {
                stationEntryLogModel.set(stationEntryLogData);
                self.dispatcher.trigger(EventNameEnum.checkOutSuccess, stationEntryLogModel);
                deferred.resolve(stationEntryLogModel);
            })
            .fail(function (error) {
                self.dispatcher.trigger(EventNameEnum.checkOutError, error);
                deferred.reject(error);
            });

        return deferred.promise();
    }
});

module.exports = StationEntryLogViewController;