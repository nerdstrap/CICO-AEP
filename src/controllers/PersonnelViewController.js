'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var PersonnelModel = require('models/PersonnelModel');
var StationEntryLogModel = require('models/StationEntryLogModel');
var PersonnelSearchView = require('views/PersonnelSearchView');
var PersonnelDetailView = require('views/PersonnelDetailView');
var EventNameEnum = require('enums/EventNameEnum');
var PersonnelTypeEnum = require('enums/PersonnelTypeEnum');
var CheckInTypeEnum = require('enums/CheckInTypeEnum');

var PersonnelController = function (options) {
    this.initialize.apply(this, arguments);
};

_.extend(PersonnelController.prototype, Backbone.Events, {

    initialize: function (options) {
        console.trace('PersonnelController.initialize');
        options || (options = {});
        this.router = options.router;
        this.dispatcher = options.dispatcher;
        this.geoLocationService = options.geoLocationService;
        this.persistenceContext = options.persistenceContext;

        this.listenTo(this.dispatcher, EventNameEnum.goToPersonnelSearch, this.goToPersonnelSearch);
        this.listenTo(this.dispatcher, EventNameEnum.goToPersonnelDetails, this.goToPersonnelDetails);
        this.listenTo(this.dispatcher, EventNameEnum.getPersonnels, this.getPersonnels);
    },

    goToPersonnelSearch: function () {
        var self = this;
        var deferred = $.Deferred();
        var myPersonnelModel = new PersonnelModel();
        var myOpenStationEntryLogModel = new StationEntryLogModel();
        var personnelSearchView = new PersonnelSearchView({
            dispatcher: self.dispatcher,
            myPersonnelModel: myPersonnelModel,
            myOpenStationEntryLogModel: myOpenStationEntryLogModel
        });

        self.router.swapContent(personnelSearchView);
        self.router.navigate('personnel');

        $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog())
            .done(function (myPersonnelData, myOpenStationEntryLogData) {
                myPersonnelModel.set(myPersonnelData);
                myOpenStationEntryLogModel.set(myOpenStationEntryLogData);
                self.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel, myOpenStationEntryLogModel);
                personnelSearchView.trigger('loaded');
                deferred.resolve(personnelSearchView);
            })
            .fail(function (error) {
                personnelSearchView.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    goToPersonnelDetails: function (personnelId) {
        var self = this;
        var deferred = $.Deferred();
        var myPersonnelModel = new PersonnelModel();
        var myOpenStationEntryLogModel = new StationEntryLogModel();
        var personnelModel = new PersonnelModel();
        var personnelDetailView = new PersonnelDetailView({
            dispatcher: self.dispatcher,
            model: personnelModel,
            myPersonnelModel: myPersonnelModel,
            myOpenStationEntryLogModel: myOpenStationEntryLogModel
        });

        self.router.swapContent(personnelDetailView);
        self.router.navigate('personnel/' + personnelId);

        $.when(self.persistenceContext.getMyPersonnel(), self.persistenceContext.getMyOpenStationEntryLog(), self.persistenceContext.getPersonnel({personnelId: personnelId}))
            .done(function (myPersonnelData, myOpenStationEntryLogData, personnelData) {
                myPersonnelModel.set(myPersonnelData);
                myOpenStationEntryLogModel.set(myOpenStationEntryLogData);
                self.dispatcher.trigger(EventNameEnum.myPersonnelReset, myPersonnelModel, myOpenStationEntryLogModel);
                personnelModel.set(personnelData);
                personnelDetailView.trigger('loaded');
                deferred.resolve(personnelDetailView);
            })
            .fail(function (error) {
                personnelDetailView.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getPersonnels: function (personnelCollection, options) {
        var self = this;
        var deferred = $.Deferred();
        self.persistenceContext.getPersonnels(options)
            .done(function (personnelsData) {
                personnelCollection.reset(personnelsData);
                deferred.resolve(personnelCollection);
            })
            .fail(function (error) {
                personnelCollection.trigger('error', error);
                deferred.reject(error);
            });

        return deferred.promise();
    }
});

module.exports = PersonnelController;