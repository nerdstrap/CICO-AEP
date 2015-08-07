define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var StationModel = require('models/StationModel');
    var PersonnelModel = require('models/PersonnelModel');
    var StationEntryLogModel = require('models/StationEntryLogModel');
    var AdHocCheckInModalView = require('views/AdHocCheckInModalView');
    var CheckInModalView = require('views/CheckInModalView');
    var EditCheckInModalView = require('views/EditCheckInModalView');
    var CheckOutModalView = require('views/CheckOutModalView');
    var EventNameEnum = require('enums/EventNameEnum');
    var StationTypeEnum = require('enums/StationTypeEnum');
    var CheckInTypeEnum = require('enums/CheckInTypeEnum');

    var StationEntryLogViewController = function (options) {
        options || (options = {});
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

            this.listenTo(this.dispatcher, EventNameEnum.goToAdHocStationDetailWithId, this.goToAdHocStationDetailWithId);
            this.listenTo(this.dispatcher, EventNameEnum.goToAdHocCheckIn, this.goToAdHocCheckIn);
            this.listenTo(this.dispatcher, EventNameEnum.goToCheckIn, this.goToCheckIn);
            this.listenTo(this.dispatcher, EventNameEnum.checkIn, this.checkIn);
            this.listenTo(this.dispatcher, EventNameEnum.goToEditCheckIn, this.goToEditCheckIn);
            this.listenTo(this.dispatcher, EventNameEnum.editCheckIn, this.editCheckIn);
            this.listenTo(this.dispatcher, EventNameEnum.goToCheckOut, this.goToCheckOut);
            this.listenTo(this.dispatcher, EventNameEnum.checkOut, this.checkOut);
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
            var adHocCheckInModalView = new AdHocCheckInModalView({
                dispatcher: self.dispatcher,
                myPersonnelModel: myPersonnelModel,
                myOpenStationEntryLogModel: myOpenStationEntryLogModel,
                model: stationEntryLogModel,
                purposeCollection: purposeCollection,
                durationCollection: durationCollection,
                areaCollection: areaCollection
            });

            self.router.showModal(adHocCheckInModalView);

            $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog(), self.persistenceContext.getOptions())
                .done(function (myPersonnelData, myOpenStationEntryLogData, stationData, optionsData) {
                    myPersonnelModel.set(myPersonnelData);
                    myOpenStationEntryLogModel.set(myOpenStationEntryLogData);
                    self.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel, myOpenStationEntryLogModel);
                    adHocCheckInModalView.trigger('loaded');
                    deferred.resolve(adHocCheckInModalView);
                })
                .fail(function (error) {
                    adHocCheckInModalView.trigger('error', error);
                    deferred.rejectWith(self, [error]);
                });


            self.geoLocationService.getCurrentPosition()
                .done(function (position) {
                    adHocCheckInModalView.updateGpsLabel(position.coords.latitude.toFixed(6), position.coords.longitude.toFixed(6));
                })
                .fail(function (getCurrentPositionError) {
                    adHocCheckInModalView.updateGpsLabel();
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
            var stationModel = new StationModel({
                stationId: stationId
            });
            var purposeCollection = new Backbone.Collection();
            var durationCollection = new Backbone.Collection();
            var checkInModalView = new CheckInModalView({
                dispatcher: self.dispatcher,
                myPersonnelModel: myPersonnelModel,
                myOpenStationEntryLogModel: myOpenStationEntryLogModel,
                model: stationEntryLogModel,
                stationModel: stationModel,
                purposeCollection: purposeCollection,
                durationCollection: durationCollection
            });

            self.router.showModal(checkInModalView);

            $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog(), self.persistenceContext.getStationByStationId(stationId), self.persistenceContext.getOptions())
                .done(function (myPersonnelData, myOpenStationEntryLogData, stationData, optionsData) {
                    myPersonnelModel.set(myPersonnelData);
                    myOpenStationEntryLogModel.set(myOpenStationEntryLogData);
                    self.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel, myOpenStationEntryLogModel);
                    stationModel.set(stationData);
                    checkInModalView.trigger('loaded');
                    deferred.resolve(checkInModalView);
                })
                .fail(function (error) {
                    checkInModalView.trigger('error', error);
                    deferred.reject(error);
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

        goToEditCheckIn: function (stationEntryLogId, stationId) {
            var self = this;
            var deferred = $.Deferred();
            var myPersonnelModel = new PersonnelModel();
            var myOpenStationEntryLogModel = new StationEntryLogModel();
            var stationEntryLogModel = new StationEntryLogModel({
                stationEntryLogId: stationEntryLogId
            });
            var durationCollection = new Backbone.Collection();
            var editCheckInModalView = new EditCheckInModalView({
                dispatcher: self.dispatcher,
                myPersonnelModel: myPersonnelModel,
                myOpenStationEntryLogModel: myOpenStationEntryLogModel,
                model: stationEntryLogModel,
                durationCollection: durationCollection
            });

            self.router.showModal(editCheckInModalView);

            $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog(), self.persistenceContext.getStationEntryLogByStationEntryLogId(stationEntryLogId), self.persistenceContext.getOptions())
                .done(function (myPersonnelData, myOpenStationEntryLogData, stationEntryLogData, optionsData) {
                    myPersonnelModel.set(myPersonnelData);
                    myOpenStationEntryLogModel.set(myOpenStationEntryLogData);
                    self.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel, myOpenStationEntryLogModel);
                    stationEntryLogModel.set(stationEntryLogData);
                    var stationId = stationEntryLogModel.get('stationId');
                    if (stationId) {
                        self.persistenceContext.getStationByStationId(stationId)
                            .done(function (station) {
                                editCheckInModalView.trigger('loaded');
                                deferred.resolve(editCheckInModalView);
                            })
                            .fail(function (getStationByStationIdError) {
                                editCheckInModalView.trigger('error', getStationByStationIdError);
                                deferred.reject(getStationByStationIdError);
                            });
                    } else {
                        editCheckInModalView.trigger('loaded');
                        deferred.resolve(editCheckInModalView);
                    }
                })
                .fail(function (error) {
                    editCheckInModalView.trigger('error', error);
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
            var stationEntryLogModel = new StationEntryLogModel({
                stationEntryLogId: stationEntryLogId
            });
            var checkOutModalView = new CheckOutModalView({
                dispatcher: self.dispatcher,
                myPersonnelModel: myPersonnelModel,
                myOpenStationEntryLogModel: myOpenStationEntryLogModel,
                model: stationEntryLogModel
            });

            self.router.showModal(checkOutModalView);

            $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog(), self.persistenceContext.getStationEntryLogByStationEntryLogId(stationEntryLogId))
                .done(function (myPersonnelData, myOpenStationEntryLogData, stationEntryLogData) {
                    myPersonnelModel.set(myPersonnelData);
                    myOpenStationEntryLogModel.set(myOpenStationEntryLogData);
                    self.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel, myOpenStationEntryLogModel);
                    stationEntryLogModel.set(stationEntryLogData);
                    var stationId = stationEntryLogModel.get('stationId');
                    if (stationId) {
                        self.persistenceContext.getStationByStationId(stationId)
                            .done(function (station) {
                                checkOutModalView.trigger('loaded');
                                deferred.resolve(checkOutModalView);
                            })
                            .fail(function (getStationByStationIdError) {
                                checkOutModalView.trigger('error', getStationByStationIdError);
                                deferred.reject(getStationByStationIdError);
                            });
                    } else {
                        checkOutModalView.trigger('loaded');
                        deferred.resolve(checkOutModalView);
                    }
                })
                .fail(function (error) {
                    checkOutModalView.trigger('error', error);
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        checkOut: function (stationEntryLogModel) {
            var self = this;
            var deferred = $.Deferred();

            self.persistenceContext.checkOut(stationEntryLogModel.attributes)
                .done(function (stationEntryLog) {
                    stationEntryLogModel.set(stationEntryLog);
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

    return StationEntryLogViewController;
});