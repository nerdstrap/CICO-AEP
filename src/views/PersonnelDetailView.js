define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseDetailView = require('views/BaseDetailView');
    var EventNameEnum = require('enums/EventNameEnum');
    var PersonnelTypeEnum = require('enums/PersonnelTypeEnum');
    var StationEntryLogCollection = require('collections/StationEntryLogCollection');
    var StationEntryLogTileView = require('views/StationEntryLogTileView');
    var StationEntryLogCollectionView = require('views/StationEntryLogCollectionView');
    var utils = require('utils');
    var template = require('hbs!templates/PersonnelDetailView');

    var PersonnelDetailView = BaseDetailView.extend({

        initialize: function (options) {
            BaseDetailView.prototype.initialize.apply(this, arguments);
            options || (options = {});
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

            this.myPersonnelModel = options.myPersonnelModel;
            this.myOpenStationEntryLogModel = options.myOpenStationEntryLogModel;

            this.recentStationEntryLogCollection = options.recentStationEntryLogCollection || new StationEntryLogCollection();

            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'error', this.onError);
        },

        render: function () {
            this.setElement(template(this.renderModel(this.model)));
            this.renderOpenStationEntryLogView()
            this.renderRecentStationEntryLogCollectionView();
            return this;
        },

        renderOpenStationEntryLogView: function () {
            this.openStationEntryLogTileView = new StationEntryLogTileView({
                dispatcher: this.dispatcher,
                model: this.myOpenStationEntryLogModel,
                showStation: true,
                showPersonnel: false
            });
            this.appendChildTo(this.openStationEntryLogTileView, '#open-station-entry-log-view-container .tile-wrap');
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
            'click #go-to-station-button': 'goToStationDetailWithId',
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
            if (this.model.has('userName')) {
                var userName = this.model.get('userName');
                this.$('#user-name-header').text(userName);
            }
            return this;
        },

        updateCallContactNumberButton: function () {
            if (this.model.has('contactNumber')) {
                var contactNumber = this.model.get('contactNumber');
                this.$('#call-contact-number-button').text(utils.formatPhone(utils.cleanPhone(contactNumber)));
            }
            return this;
        },

        updateSendEmailButton: function () {
            if (this.model.has('email')) {
                var email = this.model.get('email');
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

        goToStationDetailWithId: function (event) {
            if (event) {
                event.preventDefault();
            }
            if (this.myOpenStationEntryLogModel.has('stationId')) {
                var stationId = this.myOpenStationEntryLogModel.get('stationId');
                this.dispatcher.trigger(EventNameEnum.goToStationDetailWithId, stationId);
            } else {
                var stationEntryLogId = this.myOpenStationEntryLogModel.get('stationEntryLogId');
                this.dispatcher.trigger(EventNameEnum.goToAdHocStationWithId, stationEntryLogId);
            }
        },

        onLoaded: function () {
            this.updateViewFromModel();
            this.showLoading();
            var options = {
                personnelId: this.model.get('personnelId')
            };
            this.openStationEntryLogTileView.updateViewFromModel();
            this.dispatcher.trigger(EventNameEnum.refreshStationEntryLogCollection, this.recentStationEntryLogCollection, _.extend({}, options, {recent: true}));
        },

        onError: function (error) {
            this.showError(error);
        }
    });

    return PersonnelDetailView;
});