define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var StationModel = require('models/StationModel');
    var PersonnelModel = require('models/PersonnelModel');
    var StationEntryLogModel = require('models/StationEntryLogModel');
    var CheckInModalView = require('views/CheckInModalView');
    var EditCheckInModalView = require('views/EditCheckInModalView');
    var CheckOutModalView = require('views/CheckOutModalView');
    var EventNameEnum = require('enums/EventNameEnum');
    var StationTypeEnum = require('enums/StationTypeEnum');
    var CheckInTypeEnum = require('enums/CheckInTypeEnum');

    /**
     *
     * @param options
     * @constructor
     */
    var StationEntryLogViewController = function(options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(StationEntryLogViewController.prototype, Backbone.Events, {
        /**
         *
         * @param options
         */
        initialize: function(options) {
            console.trace('StationEntryLogViewController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher;
            this.persistenceContext = options.persistenceContext;

            this.listenTo(this.dispatcher, EventNameEnum.goToAdHocLandingWithId, this.goToAdHocLandingWithId);
            this.listenTo(this.dispatcher, EventNameEnum.goToAdHocCheckIn, this.goToAdHocCheckIn);
            this.listenTo(this.dispatcher, EventNameEnum.goToCheckIn, this.goToCheckIn);
            this.listenTo(this.dispatcher, EventNameEnum.checkIn, this.checkIn);
            this.listenTo(this.dispatcher, EventNameEnum.goToEditCheckIn, this.goToEditCheckIn);
            this.listenTo(this.dispatcher, EventNameEnum.editCheckIn, this.editCheckIn);
            this.listenTo(this.dispatcher, EventNameEnum.goToCheckOut, this.goToCheckOut);
            this.listenTo(this.dispatcher, EventNameEnum.checkOut, this.checkOut);
        },
        /**
         *
         * @returns {promise}
         */
        goToAdHocCheckIn: function() {
            var currentContext = this;
            var deferred = $.Deferred();

            var myPersonnelModel = new PersonnelModel();
            var openStationEntryLogModel = new StationEntryLogModel();
            var stationEntryLogModel = new StationEntryLogModel({checkInType: CheckInTypeEnum.station});
            var purposeCollection = new Backbone.Collection();
            var durationCollection = new Backbone.Collection();
            var areaCollection = new Backbone.Collection();
            var checkInView = new CheckInModalView({
                dispatcher: currentContext.dispatcher,
                myPersonnelModel: myPersonnelModel,
                openStationEntryLogModel: openStationEntryLogModel,
                model: stationEntryLogModel,
                purposeCollection: purposeCollection,
                durationCollection: durationCollection,
                areaCollection: areaCollection
            });

            currentContext.router.swapContent(checkInView);
            currentContext.router.navigate('adhoc/checkIn');

            $.when(currentContext.persistenceContext.getMyPersonnelAndOpenStationEntryLogs(myPersonnelModel, openStationEntryLogModel), currentContext.persistenceContext.getOptions(purposeCollection, durationCollection, areaCollection))
                    .done(function() {
                        currentContext.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel);
                        checkInView.trigger('loaded');
                        deferred.resolve(checkInView);
                    })
                    .fail(function(error) {
                        checkInView.trigger('error');
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        
        /**
         *
         * @param stationId
         * @returns {promise}
         */
        goToCheckIn: function(stationId) {
            var currentContext = this;
            var deferred = $.Deferred();

            var myPersonnelModel = new PersonnelModel();
            var openStationEntryLogModel = new StationEntryLogModel();
            var stationEntryLogModel = new StationEntryLogModel({checkInType: CheckInTypeEnum.station});
            
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
            
            var purposeCollection = new Backbone.Collection();
            var durationCollection = new Backbone.Collection();
            var areaCollection = new Backbone.Collection();
            var checkInView = new CheckInModalView({
                dispatcher: currentContext.dispatcher,
                myPersonnelModel: myPersonnelModel,
                openStationEntryLogModel: openStationEntryLogModel,
                model: stationEntryLogModel,
                stationModel: stationModel,
                purposeCollection: purposeCollection,
                durationCollection: durationCollection,
                areaCollection: areaCollection
            });

            currentContext.router.swapContent(checkInView);
            currentContext.router.navigate('station/' + stationModel.get('stationId') + '/checkIn');

            $.when(currentContext.persistenceContext.getMyPersonnelAndOpenStationEntryLogs(myPersonnelModel, openStationEntryLogModel), currentContext.persistenceContext.getStationById(stationModel), currentContext.persistenceContext.getOptions(purposeCollection, durationCollection, areaCollection))
                    .done(function() {
                        currentContext.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel);
                        checkInView.trigger('loaded');
                        deferred.resolve(checkInView);
                    })
                    .fail(function(error) {
                        checkInView.trigger('error');
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param stationEntryLogModel
         * @returns {promise}
         */
        checkIn: function(stationEntryLogModel) {
            var currentContext = this;
            var deferred = $.Deferred();

            currentContext.persistenceContext.checkIn(stationEntryLogModel)
                    .done(function() {
                        currentContext.dispatcher.trigger(EventNameEnum.checkInSuccess, stationEntryLogModel);
                        deferred.resolve(stationEntryLogModel);
                    })
                    .fail(function(error) {
                        currentContext.dispatcher.trigger(EventNameEnum.checkInError, error);
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param currentStationEntryLogModel
         * @returns {promise}
         */
        goToEditCheckIn: function(currentStationEntryLogModel) {
            var currentContext = this;
            var deferred = $.Deferred();

            var myPersonnelModel = new PersonnelModel();
            var openStationEntryLogModel = new StationEntryLogModel();
            
            var stationId = currentStationEntryLogModel.get('stationId');
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
            
            var stationEntryLogModel = new StationEntryLogModel();
            var purposeCollection = new Backbone.Collection();
            var durationCollection = new Backbone.Collection();
            var areaCollection = new Backbone.Collection();
            var editCheckInView = new EditCheckInModalView({
                dispatcher: currentContext.dispatcher,
                myPersonnelModel: myPersonnelModel,
                openStationEntryLogModel: openStationEntryLogModel,
                stationModel: stationModel,
                purposeCollection: purposeCollection,
                durationCollection: durationCollection,
                areaCollection: areaCollection
            });

            currentContext.router.swapContent(editCheckInView);
            currentContext.router.navigate('stationEntryLog/' + currentStationEntryLogModel.get('stationEntryLogId'));

            $.when(currentContext.persistenceContext.getMyPersonnelAndOpenStationEntryLogs(myPersonnelModel, openStationEntryLogModel), currentContext.persistenceContext.getStationEntryLogById(stationEntryLogModel), currentContext.persistenceContext.getStationById(stationModel), currentContext.persistenceContext.getOptions(purposeCollection, durationCollection, areaCollection))
                    .done(function() {
                        currentContext.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel);
                        editCheckInView.trigger('loaded');
                        deferred.resolve(editCheckInView);
                    })
                    .fail(function(error) {
                        editCheckInView.trigger('error');
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param stationEntryLogModel
         * @returns {promise}
         */
        editCheckIn: function(stationEntryLogModel) {
            var currentContext = this;
            var deferred = $.Deferred();

            currentContext.persistenceContext.editCheckIn(stationEntryLogModel)
                    .done(function() {
                        currentContext.dispatcher.trigger(EventNameEnum.editCheckInSuccess, stationEntryLogModel);
                        deferred.resolve(stationEntryLogModel);
                    })
                    .fail(function(error) {
                        currentContext.dispatcher.trigger(EventNameEnum.editCheckInError, error);
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param currentStationEntryLogModel
         * @returns {promise}
         */
        goToCheckOut: function(currentStationEntryLogModel) {
            var currentContext = this;
            var deferred = $.Deferred();

            var myPersonnelModel = new PersonnelModel();
            var openStationEntryLogModel = new StationEntryLogModel();
            
            var stationId = currentStationEntryLogModel.get('stationId');
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
            
            var stationEntryLogModel = new StationEntryLogModel();
            var purposeCollection = new Backbone.Collection();
            var durationCollection = new Backbone.Collection();
            var areaCollection = new Backbone.Collection();
            var checkOutView = new CheckOutModalView({
                dispatcher: currentContext.dispatcher,
                myPersonnelModel: myPersonnelModel,
                openStationEntryLogModel: openStationEntryLogModel,
                stationModel: stationModel,
                purposeCollection: purposeCollection,
                durationCollection: durationCollection,
                areaCollection: areaCollection
            });

            currentContext.router.swapContent(checkOutView);
            currentContext.router.navigate('stationEntryLog/' + currentStationEntryLogModel.get('stationEntryLogId') + '/checkOut');

            $.when(currentContext.persistenceContext.getMyPersonnelAndOpenStationEntryLogs(myPersonnelModel, openStationEntryLogModel), currentContext.persistenceContext.getStationEntryLogById(stationEntryLogModel), currentContext.persistenceContext.getStationById(stationModel), currentContext.persistenceContext.getOptions(purposeCollection, durationCollection, areaCollection))
                    .done(function() {
                        currentContext.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel);
                        checkOutView.trigger('loaded');
                        deferred.resolve(checkOutView);
                    })
                    .fail(function(error) {
                        checkOutView.trigger('error');
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param stationEntryLogModel
         * @returns {promise}
         */
        checkOut: function(stationEntryLogModel) {
            var currentContext = this;
            var deferred = $.Deferred();

            currentContext.persistenceContext.checkOut(stationEntryLogModel)
                    .done(function() {
                        currentContext.dispatcher.trigger(EventNameEnum.checkOutSuccess, stationEntryLogModel);
                        deferred.resolve(stationEntryLogModel);
                    })
                    .fail(function(error) {
                        currentContext.dispatcher.trigger(EventNameEnum.checkOutError, error);
                        deferred.reject(error);
                    });

            return deferred.promise();
        }
    });

    return StationEntryLogViewController;
});