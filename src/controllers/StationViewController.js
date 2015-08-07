define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
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
        options || (options = {});
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

            this.listenTo(this.dispatcher, EventNameEnum.goToStationSearch, this.goToStationSearch);
            this.listenTo(this.dispatcher, EventNameEnum.goToStationDetailWithId, this.goToStationDetailWithId);
            this.listenTo(this.dispatcher, EventNameEnum.goToAdHocStationDetailWithId, this.goToAdHocStationDetailWithId);
            this.listenTo(this.dispatcher, EventNameEnum.getNearbyStations, this.getNearbyStations);
            this.listenTo(this.dispatcher, EventNameEnum.getRecentStations, this.getRecentStations);
            this.listenTo(this.dispatcher, EventNameEnum.getStationsByStationName, this.getStationsByStationName);
            this.listenTo(this.dispatcher, EventNameEnum.getAbnormalConditions, this.getAbnormalConditions);
            this.listenTo(this.dispatcher, EventNameEnum.getWarnings, this.getWarnings);

            this.distanceThreshold = 50;
            this.resultCountThreshold = 20;
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

        goToStationDetailWithId: function (stationId) {
            var self = this;
            var deferred = $.Deferred();
            var myPersonnelModel = new PersonnelModel();
            var myOpenStationEntryLogModel = new StationEntryLogModel();
            var stationModel = new StationModel({
                stationId: stationId
            });
            var stationDetailView = new StationDetailView({
                dispatcher: self.dispatcher,
                model: stationModel,
                myPersonnelModel: myPersonnelModel,
                myOpenStationEntryLogModel: myOpenStationEntryLogModel
            });

            self.router.swapContent(stationDetailView);
            self.router.navigate('station/' + stationId);

            $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog(), self.persistenceContext.getStationByStationId(stationId))
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

        goToAdHocStationDetailWithId: function (stationEntryLogId) {
            var self = this;
            var deferred = $.Deferred();

            var myPersonnelModel = new PersonnelModel();
            var myOpenStationEntryLogModel = new StationEntryLogModel();
            var stationEntryLogModel = new StationEntryLogModel({
                stationEntryLogId: stationEntryLogId,
                checkInType: CheckInTypeEnum.adHoc,
                stationType: StationTypeEnum.tc
            });
            var adHocStationView = new AdHocStationDetailView({
                dispatcher: self.dispatcher,
                model: stationEntryLogModel,
                myPersonnelModel: myPersonnelModel,
                myOpenStationEntryLogModel: myOpenStationEntryLogModel
            });

            self.router.swapContent(adHocStationView);
            self.router.navigate('station/adhoc/' + stationEntryLogId);

            $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog(), self.persistenceContext.getStationEntryLogByStationEntryLogId(stationEntryLogId))
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

        getNearbyStations: function (stationCollection, includeDol, includeNoc) {
            var self = this;
            var deferred = $.Deferred();
            self.geoLocationService.getCurrentPosition()
                .done(function (position) {
                    self.persistenceContext.getNearbyStations(position.coords.latitude, position.coords.longitude, includeDol, includeNoc, self.distanceThreshold, self.resultCountThreshold)
                        .done(function (stationsData) {
                            stationCollection.reset(stationsData);
                            deferred.resolve(stationCollection);
                        })
                        .fail(function (getNearbyStationsError) {
                            stationCollection.trigger('error', getNearbyStationsError);
                            deferred.reject(getNearbyStationsError);
                        });
                })
                .fail(function (getCurrentPositionError) {
                    stationCollection.trigger('error', getCurrentPositionError);
                    deferred.reject(getCurrentPositionError);
                });

            return deferred.promise();
        },

        getRecentStations: function (stationCollection, includeDol, includeNoc) {
            var self = this;
            var deferred = $.Deferred();
            self.persistenceContext.getRecentStations(includeDol, includeNoc, self.resultCountThreshold)
                .done(function (stationsData) {
                    stationCollection.reset(stationsData);
                    deferred.resolve(stationCollection);
                })
                .fail(function (getRecentStationsError) {
                    stationCollection.trigger('error', getRecentStationsError);
                    deferred.reject(getRecentStationsError);
                });

            return deferred.promise();
        },

        getStationsByStationName: function (stationCollection, stationName, includeDol, includeNoc) {
            var self = this;
            var deferred = $.Deferred();
            self.persistenceContext.getStationsByStationName(stationName, includeDol, includeNoc)
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

        getAbnormalConditionsByStationId: function (abnormalConditionCollection, stationId) {
            var self = this;
            var deferred = $.Deferred();
            self.persistenceContext.getAbnormalConditionsByStationId(stationId)
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

        getWarningsByStationId: function (warningCollection, stationId) {
            var self = this;
            var deferred = $.Deferred();
            self.persistenceContext.getWarningsByStationId(stationId)
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

            $.when(self.persistenceContext.postAddWarning(warningModel.attributes)).done(function (postAddWarningResults) {
                warningModel.set(postAddWarningResults.warning);
                warningModel.trigger(EventNameEnum.addWarningSuccess, postAddWarningResults.warning);
                deferred.resolveWith(self, [postAddWarningResults]);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                warningModel.trigger(EventNameEnum.addWarningError, jqXHR.responseText);
                deferred.reject('error');
            });

            return deferred.promise();
        },

        clearWarning: function (warningModel) {
            var self = this;
            var deferred = $.Deferred();

            self.persistenceContext.postClearWarning(warningModel.attributes)
                .done(function (postClearWarningResults) {
                    warningModel.set(postClearWarningResults.warning);
                    warningModel.trigger(EventNameEnum.clearWarningSuccess, postClearWarningResults.warning);
                    deferred.resolveWith(self, [postClearWarningResults]);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    warningModel.clear();
                    deferred.reject('error');
                });

            return deferred.promise();
        }
    });

    return StationController;
});