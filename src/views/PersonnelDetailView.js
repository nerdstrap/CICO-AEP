'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var StationEntryLogCollection = require('collections/StationEntryLogCollection');
var StationEntryLogCollectionView = require('views/StationEntryLogCollectionView');
var utils = require('lib/utils');
var template = require('templates/PersonnelDetailView.hbs');

var PersonnelDetailView = BaseView.extend({

    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
        options || (options = {});
        this.controller = options.controller;
        this.dispatcher = options.dispatcher || this;
        this.myPersonnelModel = options.myPersonnelModel;
        this.myOpenStationEntryLogModel = options.myOpenStationEntryLogModel;
        this.openStationEntryLogCollection = options.openStationEntryLogCollection || new StationEntryLogCollection();
        this.recentStationEntryLogCollection = options.recentStationEntryLogCollection || new StationEntryLogCollection();
        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'error', this.onError);
    },

    render: function () {
        this.setElement(template(this.renderModel(this.model)));
        this.renderOpenStationEntryLogCollectionView();
        this.renderRecentStationEntryLogCollectionView();
        return this;
    },

    renderOpenStationEntryLogCollectionView: function () {
        this.openStationEntryLogCollectionViewInstance = new StationEntryLogCollectionView({
            dispatcher: this.dispatcher,
            collection: this.recentStationEntryLogCollection,
            showPersonnel: false,
            showStation: true
        });
        this.appendChildTo(this.openStationEntryLogCollectionViewInstance, '#open-station-entry-log-collection-view-container');
        return this;
    },

    renderRecentStationEntryLogCollectionView: function () {
        this.recentStationEntryLogCollectionViewInstance = new StationEntryLogCollectionView({
            dispatcher: this.dispatcher,
            collection: this.recentStationEntryLogCollection,
            showPersonnel: false,
            showStation: true
        });
        this.appendChildTo(this.recentStationEntryLogCollectionViewInstance, '#recent-station-entry-log-collection-view-container');
        return this;
    },

    events: {
        'click #go-to-station-button': 'goToStationDetails',
        'click #call-contact-number-button': 'callContactNumber',
        'click #send-email-button': 'sendEmail',
        'click [data-toggle="panel"]': 'togglePanel'
    },

    updateViewFromModel: function () {
        this.updateUserNameHeader();
        this.updateCallContactNumberButton();
        this.updateSendEmailButton();
        return this;
    },

    updateUserNameHeader: function () {
        var userName = this.model.get('userName');
        if (userName) {
            this.$('#user-name-header').text(userName);
        }
        return this;
    },

    updateCallContactNumberButton: function () {
        var contactNumber = this.model.get('contactNumber');
        if (contactNumber) {
            this.$('#call-contact-number-button').text(utils.formatPhone(utils.cleanPhone(contactNumber)));
        }
        return this;
    },

    updateSendEmailButton: function () {
        var email = this.model.get('email');
        if (email) {
            this.$('#send-email-button').text(email);
        }
        return this;
    },

    callContactNumber: function (event) {
        if (event) {
            event.preventDefault();
        }
    },

    sendEmail: function (event) {
        if (event) {
            event.preventDefault();
        }
    },

    goToStationDetails: function (event) {
        if (event) {
            event.preventDefault();
        }
        var stationId = this.myOpenStationEntryLogModel.get('stationId');
        if (stationId) {
            this.dispatcher.trigger(EventNameEnum.goToStationDetails, stationId);
        } else {
            var stationEntryLogId = this.myOpenStationEntryLogModel.get('stationEntryLogId');
            this.dispatcher.trigger(EventNameEnum.goToAdHocStationDetails, stationEntryLogId);
        }
    },

    onLoaded: function () {
        this.updateViewFromModel();
        this.showLoading();
        var options = {
            personnelId: this.model.get('personnelId')
        };
        this.dispatcher.trigger(EventNameEnum.getOpenStationEntryLogs, this.openStationEntryLogCollection, _.extend({}, options));
        this.dispatcher.trigger(EventNameEnum.getRecentStationEntryLogs, this.recentStationEntryLogCollection, _.extend({}, options));
    },

    onError: function (error) {
        this.showError(error);
    }

});

module.exports = PersonnelDetailView;