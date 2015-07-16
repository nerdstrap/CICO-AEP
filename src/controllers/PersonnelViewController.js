define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var PersonnelModel = require('models/PersonnelModel');
    var PersonnelSearchView = require('views/PersonnelSearchView');
    var PersonnelView = require('views/PersonnelView');
    var EventNameEnum = require('enums/EventNameEnum');
    var PersonnelTypeEnum = require('enums/PersonnelTypeEnum');

    var PersonnelController = function(options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(PersonnelController.prototype, Backbone.Events, {
        /**
         * 
         * @param {type} options
         * @returns {PersonnelController}
         */
        initialize: function(options) {
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher;
            this.persistenceContext = options.persistenceContext;

            this.listenTo(this.dispatcher, EventNameEnum.goToPersonnelSearch, this.goToPersonnelSearch);
            this.listenTo(this.dispatcher, EventNameEnum.goToPersonnelWithId, this.goToPersonnelWithId);
            this.listenTo(this.dispatcher, EventNameEnum.goToPersonnelWithName, this.goToPersonnelWithName);
            this.listenTo(this.dispatcher, EventNameEnum.refreshPersonnelCollectionByGps, this.refreshPersonnelCollectionByGps);
            this.listenTo(this.dispatcher, EventNameEnum.refreshPersonnelCollection, this.refreshPersonnelCollection);
        },
        /**
         * 
         * @returns {promise}
         */
        goToPersonnelSearch: function() {
            var currentContext = this;
            var deferred = $.Deferred();

            var myPersonnelModel = new PersonnelModel();
            var openStationEntryLogModel = new StationEntryLogModel();
            var personnelSearchView = new PersonnelSearchView({
                dispatcher: currentContext.dispatcher,
                myPersonnelModel: myPersonnelModel,
                openStationEntryLogModel: openStationEntryLogModel
            });

            currentContext.router.swapContent(personnelSearchView);
            currentContext.router.navigate('personnel');

            currentContext.persistenceContext.getMyIdentityAndOpenEntryLogs(myPersonnelModel, openStationEntryLogModel)
                    .done(function() {
                        personnelSearchView.trigger('loaded');
                        deferred.resolve(personnelSearchView);
                    })
                    .fail(function(error) {
                        personnelSearchView.trigger('error');
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        
        /**
         * 
         * @param {type} userName
         * @returns {promise}
         */
        goToPersonnelWithName: function(userName) {
            var currentContext = this;
            var deferred = $.Deferred();

            var personnelModel = new PersonnelModel({
                personnelId: userName
            });

            var myPersonnelModel = new PersonnelModel();
            var openStationEntryLogModel = new StationEntryLogModel();
            var personnelView = new PersonnelView({
                dispatcher: currentContext.dispatcher,
                model: personnelModel,
                myPersonnelModel: myPersonnelModel,
                openStationEntryLogModel: openStationEntryLogModel
            });

            currentContext.router.swapContent(personnelView);
            currentContext.router.navigate('personnel/username/' + userName);

            $.when(currentContext.persistenceContext.getMyIdentityAndOpenEntryLogs(myPersonnelModel, openStationEntryLogModel), currentContext.persistenceContext.getPersonnelById(personnelModel))
                    .done(function() {
                        currentContext.dispatcher.trigger(EventNameEnum.myIdentityReset, myPersonnelModel);
                        currentContext.dispatcher.trigger(EventNameEnum.openEntryLogReset, openStationEntryLogModel);
                        personnelView.trigger('loaded');
                        deferred.resolve(personnelView);
                    })
                    .fail(function(error) {
                        personnelView.trigger('error');
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        
        /**
         * 
         * @param {type} personnelId
         * @returns {promise}
         */
        goToPersonnelWithId: function(personnelId) {
            var currentContext = this;
            var deferred = $.Deferred();

            var personnelModel = new PersonnelModel({
                personnelId: personnelId
            });

            var myPersonnelModel = new PersonnelModel();
            var openStationEntryLogModel = new StationEntryLogModel();
            var personnelView = new PersonnelView({
                dispatcher: currentContext.dispatcher,
                model: personnelModel,
                myPersonnelModel: myPersonnelModel,
                openStationEntryLogModel: openStationEntryLogModel
            });

            currentContext.router.swapContent(personnelView);
            currentContext.router.navigate('personnel/' + personnelId);

            $.when(currentContext.persistenceContext.getMyIdentityAndOpenEntryLogs(myPersonnelModel, openStationEntryLogModel), currentContext.persistenceContext.getPersonnelById(personnelModel))
                    .done(function() {
                        currentContext.dispatcher.trigger(EventNameEnum.myIdentityReset, myPersonnelModel);
                        currentContext.dispatcher.trigger(EventNameEnum.openEntryLogReset, openStationEntryLogModel);
                        personnelView.trigger('loaded');
                        deferred.resolve(personnelView);
                    })
                    .fail(function(error) {
                        personnelView.trigger('error');
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        
        /**
         * 
         * @param {type} personnelCollection
         * @param {type} options
         * @returns {promise}
         */
        refreshPersonnelCollectionByGps: function(personnelCollection, options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            personnelCollection.trigger('sync');
            currentContext.persistenceContext.refreshPersonnelCollectionByGps(personnelCollection, options)
                    .done(function() {
                        deferred.resolve(personnelCollection);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         * 
         * @param {type} personnelCollection
         * @param {type} options
         * @returns {promise}
         */
        refreshPersonnelCollection: function(personnelCollection, options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            personnelCollection.trigger('sync');
            currentContext.persistenceContext.refreshPersonnelCollection(personnelCollection, options)
                    .done(function() {
                        deferred.resolve(personnelCollection);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        }
    });

    return PersonnelController;
});