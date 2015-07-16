define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var StationModel = require('models/StationModel');
    var PersonnelModel = require('models/PersonnelModel');
    var StationEntryLogModel = require('models/StationEntryLogModel');
    var StationSearchView = require('views/StationSearchView');
    var StationView = require('views/StationView');
    var AdHocStationView = require('views/AdHocStationView');
    var EventNameEnum = require('enums/EventNameEnum');
    var StationTypeEnum = require('enums/StationTypeEnum');
    var CheckInTypeEnum = require('enums/CheckInTypeEnum');

    var StationController = function(options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(StationController.prototype, Backbone.Events, {
        /**
         * 
         * @param {type} options
         * @returns {StationController}
         */
        initialize: function(options) {
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher;
            this.persistenceContext = options.persistenceContext;

            this.listenTo(this.dispatcher, EventNameEnum.goToStationSearch, this.goToStationSearch);
            this.listenTo(this.dispatcher, EventNameEnum.goToStationWithId, this.goToStationWithId);
            this.listenTo(this.dispatcher, EventNameEnum.goToAdHocStationWithId, this.goToAdHocStationWithId);
            this.listenTo(this.dispatcher, EventNameEnum.refreshStationCollectionByGps, this.refreshStationCollectionByGps);
            this.listenTo(this.dispatcher, EventNameEnum.refreshStationCollection, this.refreshStationCollection);
            this.listenTo(this.dispatcher, EventNameEnum.refreshStationEntryLogCollection, this.refreshStationEntryLogCollection);
            this.listenTo(this.dispatcher, EventNameEnum.refreshAbnormalConditionCollection, this.refreshAbnormalConditionCollection);
            this.listenTo(this.dispatcher, EventNameEnum.refreshWarningCollection, this.refreshWarningCollection);
        },
        /**
         * 
         * @returns {promise}
         */
        goToStationSearch: function() {
            var currentContext = this;
            var deferred = $.Deferred();

            var myPersonnelModel = new PersonnelModel();
            var openStationEntryLogModel = new StationEntryLogModel();
            var stationSearchView = new StationSearchView({
                dispatcher: currentContext.dispatcher,
                myPersonnelModel: myPersonnelModel,
                openStationEntryLogModel: openStationEntryLogModel
            });

            currentContext.router.swapContent(stationSearchView);
            currentContext.router.navigate('station');

            currentContext.persistenceContext.getMyPersonnelAndOpenStationEntryLogs(myPersonnelModel, openStationEntryLogModel)
                    .done(function() {
                        stationSearchView.trigger('loaded');
                        deferred.resolve(stationSearchView);
                    })
                    .fail(function(error) {
                        stationSearchView.trigger('error');
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         * 
         * @param {type} stationId
         * @returns {promise}
         */
        goToStationWithId: function(stationId) {
            var currentContext = this;
            var deferred = $.Deferred();

            var idRegex = /^\d+$/;
            var stationType = StationTypeEnum.td;
            if (idRegex.test(stationId)) {
                stationId = parseInt(stationId, 10);
            } else {
                stationType = StationTypeEnum.tc;
            }
            var stationModel = new StationModel({
                stationId: stationId,
                stationType: stationType
            });

            var myPersonnelModel = new PersonnelModel();
            var openStationEntryLogModel = new StationEntryLogModel();
            var stationView = new StationView({
                dispatcher: currentContext.dispatcher,
                model: stationModel,
                myPersonnelModel: myPersonnelModel,
                openStationEntryLogModel: openStationEntryLogModel
            });

            currentContext.router.swapContent(stationView);
            currentContext.router.navigate('station/' + stationId);

            $.when(currentContext.persistenceContext.getMyPersonnelAndOpenStationEntryLogs(myPersonnelModel, openStationEntryLogModel), currentContext.persistenceContext.getStationById(stationModel))
                    .done(function() {
                        currentContext.dispatcher.trigger(EventNameEnum.myIdentityReset, myPersonnelModel);
                        currentContext.dispatcher.trigger(EventNameEnum.openEntryLogReset, openStationEntryLogModel);
                        stationView.trigger('loaded');
                        deferred.resolve(stationView);
                    })
                    .fail(function(error) {
                        stationView.trigger('error');
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        
        /**
         * 
         * @param {type} stationEntryLogId
         * @returns {promise}
         */
        goToAdHocStationWithId: function(stationEntryLogId) {
            var currentContext = this;
            var deferred = $.Deferred();
            
            var myPersonnelModel = new PersonnelModel();
            var openStationEntryLogModel = new StationEntryLogModel();
            var stationEntryLogModel = new StationEntryLogModel({
                stationEntryLogId: stationEntryLogId,
                checkInType: CheckInTypeEnum.adhoc,
                stationType: StationTypeEnum.tc
            });
            var adHocStationView = new AdHocStationView({
                dispatcher: currentContext.dispatcher,
                model: stationEntryLogModel,
                myPersonnelModel: myPersonnelModel,
                openStationEntryLogModel: openStationEntryLogModel
            });

            currentContext.router.swapContent(adHocStationView);
            currentContext.router.navigate('entry/adhoc/' + stationEntryLogId);

            $.when(currentContext.persistenceContext.getMyPersonnelAndOpenStationEntryLogs(myPersonnelModel, openStationEntryLogModel), currentContext.persistenceContext.getStationEntryLogById(stationEntryLogModel))
                    .done(function() {
                        currentContext.dispatcher.trigger(EventNameEnum.myIdentityReset, myPersonnelModel);
                        currentContext.dispatcher.trigger(EventNameEnum.openEntryLogReset, openStationEntryLogModel);
                        adHocStationView.trigger('loaded');
                        deferred.resolve(adHocStationView);
                    })
                    .fail(function(error) {
                        adHocStationView.trigger('error');
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         * 
         * @param {type} stationCollection
         * @param {type} options
         * @returns {promise}
         */
        refreshStationCollectionByGps: function(stationCollection, options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            stationCollection.trigger('sync');
            currentContext.persistenceContext.refreshStationCollectionByGps(stationCollection, options)
                    .done(function() {
                        deferred.resolve(stationCollection);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         * 
         * @param {type} stationCollection
         * @param {type} options
         * @returns {promise}
         */
        refreshStationCollection: function(stationCollection, options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            stationCollection.trigger('sync');
            currentContext.persistenceContext.refreshStationCollection(stationCollection, options)
                    .done(function() {
                        deferred.resolve(stationCollection);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        
        /**
         *
         * @param stationEntryLogCollection
         * @param options
         * @returns {promise}
         */
        refreshStationEntryLogCollection: function(stationEntryLogCollection, options) {
            var currentContext = this;
            var deferred = $.Deferred();

            stationEntryLogCollection.trigger('sync');
            currentContext.persistenceContext.refreshStationEntryLogCollection(stationEntryLogCollection, options)
                    .done(function() {
                        deferred.resolve(stationEntryLogCollection);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        
        /**
         *
         * @param abnormalConditionCollection
         * @param options
         * @returns {promise}
         */
        refreshAbnormalConditionCollection: function(abnormalConditionCollection, options) {
            var currentContext = this;
            var deferred = $.Deferred();

            abnormalConditionCollection.trigger('sync');
            currentContext.persistenceContext.refreshAbnormalConditionCollection(abnormalConditionCollection, options)
                    .done(function() {
                        deferred.resolve(abnormalConditionCollection);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        
        /**
         *
         * @param warningCollection
         * @param options
         * @returns {promise}
         */
        refreshWarningCollection: function(warningCollection, options) {
            var currentContext = this;
            var deferred = $.Deferred();

            warningCollection.trigger('sync');
            currentContext.persistenceContext.refreshWarningCollection(warningCollection, options)
                    .done(function() {
                        deferred.resolve(warningCollection);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        postAddStationWarning: function(stationWarningModel) {
            var currentContext = this;
            var deferred = $.Deferred();

            $.when(currentContext.appService.postAddStationWarning(stationWarningModel.attributes)).done(function(postAddWarningResults) {
                stationWarningModel.set(postAddWarningResults.stationWarning);
                stationWarningModel.trigger(EventNameEnum.addWarningSuccess, postAddWarningResults.stationWarning);
                deferred.resolve(postAddWarningResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationWarningModel.trigger(EventNameEnum.addWarningError, jqXHR.responseText);
                deferred.reject('error');
            });

            return deferred.promise();
        },
        postClearStationWarning: function(stationWarningModel) {
            var currentContext = this;
            var deferred = $.Deferred();

            $.when(currentContext.appService.postClearStationWarning(stationWarningModel.attributes)).done(function(postClearWarningResults) {
                stationWarningModel.set(postClearWarningResults.stationWarning);
                stationWarningModel.trigger(EventNameEnum.clearWarningSuccess, postClearWarningResults.stationWarning);
                deferred.resolve(postClearWarningResults);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                stationWarningModel.clear();
                deferred.reject('error');
            });

            return deferred.promise();
        }
    });

    return StationController;
});