define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var StationEntryLogCollection = require('collections/StationEntryLogCollection');
    var AbnormalConditionCollection = require('collections/AbnormalConditionCollection');
    var WarningCollection = require('collections/WarningCollection');
    var StationEntryLogCollectionView = require('views/StationEntryLogCollectionView');
    var WarningCollectionView = require('views/WarningCollectionView');
    var AbnormalConditionCollectionView = require('views/AbnormalConditionCollectionView');
    var utils = require('utils');
    var template = require('hbs!templates/StationDetailView');

    var StationDetailView = BaseView.extend({

        /**
         *
         * @param options
         */
        initialize: function (options) {
            console.trace('StationDetailView.initialize');
            options || (options = {});
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

            this.myPersonnelModel = options.myPersonnelModel;
            this.openStationEntryLogModel = options.openStationEntryLogModel;

            this.openStationEntryLogCollection = options.openStationEntryLogCollection || new StationEntryLogCollection();
            this.recentStationEntryLogCollection = options.recentStationEntryLogCollection || new StationEntryLogCollection();
            this.abnormalConditionCollection = options.abnormalConditionCollection || new AbnormalConditionCollection();
            this.warningCollection = options.warningCollection || new WarningCollection();

            this.listenTo(this.model, 'sync', this.onSync);
            this.listenTo(this.model, 'reset', this.onReset);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },

        /**
         *
         * @returns {StationDetailView}
         */
        render: function () {
            var currentContext = this;
            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.setElement(template(renderModel));
            currentContext.renderOpenStationEntryLogCollectionView();
            currentContext.renderRecentStationEntryLogCollectionView();
            currentContext.renderAbnormalConditionCollectionView();
            currentContext.renderWarningCollectionView();
            return this;
        },

        /**
         *
         * @returns {StationDetailView}
         */
        renderOpenStationEntryLogCollectionView: function () {
            var currentContext = this;
            currentContext.openStationEntryLogCollectionViewInstance = new StationEntryLogCollectionView({
                dispatcher: currentContext.dispatcher,
                collection: currentContext.openStationEntryLogCollection,
                showPersonnel: true,
                showStation: false
            });
            currentContext.appendChildTo(currentContext.openStationEntryLogCollectionViewInstance, '#open-station-entry-log-collection-view-container');
            return this;
        },

        /**
         *
         * @returns {StationDetailView}
         */
        renderRecentStationEntryLogCollectionView: function () {
            var currentContext = this;
            currentContext.recentStationEntryLogCollectionViewInstance = new StationEntryLogCollectionView({
                dispatcher: currentContext.dispatcher,
                collection: currentContext.recentStationEntryLogCollection,
                showPersonnel: true,
                showStation: false
            });
            currentContext.appendChildTo(currentContext.recentStationEntryLogCollectionViewInstance, '#recent-station-entry-log-collection-view-container');
            return this;
        },

        /**
         *
         * @returns {StationDetailView}
         */
        renderAbnormalConditionCollectionView: function () {
            var currentContext = this;
            currentContext.abnormalConditionCollectionViewInstance = new AbnormalConditionCollectionView({
                dispatcher: currentContext.dispatcher,
                collection: currentContext.abnormalConditionCollection
            });
            currentContext.appendChildTo(currentContext.abnormalConditionCollectionViewInstance, '#abnormal-condition-collection-view-container');
            return this;
        },

        /**
         *
         * @returns {StationDetailView}
         */
        renderWarningCollectionView: function () {
            var currentContext = this;
            currentContext.warningCollectionViewInstance = new WarningCollectionView({
                dispatcher: currentContext.dispatcher,
                collection: currentContext.warningCollection
            });
            currentContext.appendChildTo(currentContext.warningCollectionViewInstance, '#warning-collection-view-container');
            return this;
        },

        /**
         *
         */
        events: {
            'click #go-to-directions-button': 'goToDirectionsWithLatLng',
            'click #go-to-check-in-button': 'goToCheckIn',
            'click #go-to-check-out-button': 'goToCheckOut',
            'click #go-to-open-check-in-button': 'goToStation',
            'click #go-to-parent-station-button': 'goToStation',
            'click #go-to-child-station-button': 'goToStation'
        },

        /**
         *
         * @returns {StationDetailView}
         */
        updateViewFromModel: function () {
            var currentContext = this;
            currentContext.updateStationNameLabel();
            currentContext.updateDistanceLabel();
            return this;
        },

        /**
         *
         * @returns {StationDetailView}
         */
        updateStationNameLabel: function () {
            var currentContext = this;
            var stationName;
            if (currentContext.model.has('stationName')) {
                stationName = currentContext.model.get('stationName');
            }
            currentContext.$('#station-name-label').html(stationName);
            return this;
        },

        /**
         *
         * @returns {StationDetailView}
         */
        updateDistanceLabel: function () {
            var currentContext = this;
            var formattedDistance;
            if (currentContext.model.has('distance') && currentContext.model.has('latitude') && currentContext.model.has('longitude')) {
                currentContext.hasCoordinates = true;
                var distance = currentContext.model.get('distance').toFixed(0);
                formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance]);
            } else {
                formattedDistance = utils.getResource('coordinatesUnavailableErrorMessage');
            }
            currentContext.$('#distance-label').html(formattedDistance);
            return this;
        },


        /**
         *
         * @returns {StationDetailView}
         */
        updateCheckInControls: function () {
            var currentContext = this;

            if (currentContext.openStationEntryLogModel) {
                if (currentContext.openStationEntryLogModel.has('stationEntryLogId')) {
                    if (currentContext.openStationEntryLogModel.get('stationId') === currentContext.model.get('stationId')) {
                        currentContext.showCheckOut();
                    } else {
                        currentContext.showGoToOpenCheckIn();
                    }
                } else {
                    currentContext.showCheckIn();
                }
            }

            return this;
        },

        updateExpectedCheckOutLabel: function () {
            var currentContext = this;

            if (currentContext.openStationEntryLogModel) {
                var expectedOutTime = currentContext.openStationEntryLogModel.get('expectedOutTime');
                var formattedExpectedOutTime = utils.formatDate(expectedOutTime);
                var formattedExpectedCheckOutText = utils.formatString(utils.getResource('expectedCheckOutTextFormatString'), [formattedExpectedOutTime]);
                currentContext.$('#expected-check-out-label').html(formattedExpectedCheckOutText);
            }
            return this;
        },

        /**
         *
         * @returns {StationDetailView}
         */
        updateOpenCheckInLabel: function () {
            var currentContext = this;
            var formattedOpenCheckInText = '';
            if (currentContext.openStationEntryLogModel) {
                var stationName = currentContext.openStationEntryLogModel.get('stationName');
                var inTime = currentContext.openStationEntryLogModel.get('inTime');
                var formattedInTime = utils.formatDate(inTime);
                formattedOpenCheckInText = utils.formatString(utils.getResource('openCheckInTextFormatString'), [stationName, formattedInTime]);
                currentContext.$('#open-check-in-label').html(formattedOpenCheckInText);
            }
            return this;
        },

        /**
         *
         * @returns {StationDetailView}
         */
        showHazard: function () {
            var currentContext = this;
            var hazardNotificationMessage = utils.getResource('hazardNotificationMessage');
            currentContext.$('#hazard-notification-label').text(hazardNotificationMessage);
            currentContext.$('#hazard-notification-container').removeClass('hidden');
            currentContext.$('#hazard-detail-container').removeClass('hidden');
            currentContext.$('#check-in-container').addClass('hidden');
            currentContext.$('#check-out-container').addClass('hidden');
            currentContext.$('#open-check-in-container').addClass('hidden');
            return this;
        },

        /**
         *
         * @returns {StationDetailView}
         */
        showCheckIn: function () {
            var currentContext = this;
            if (currentContext.model.has('hasHazard') && currentContext.model.get('hasHazard') === 'true') {
                currentContext.showHazard();
            } else {
                currentContext.$('#hazard-notification-container').addClass('hidden');
                currentContext.$('#hazard-detail-container').addClass('hidden');
                currentContext.$('#check-in-container').removeClass('hidden');
                currentContext.$('#check-out-container').addClass('hidden');
                currentContext.$('#open-check-in-container').addClass('hidden');

            }
            return this;
        },

        /**
         *
         * @returns {StationDetailView}
         */
        showCheckOut: function () {
            var currentContext = this;
            if (currentContext.model.has('hasHazard') && currentContext.model.get('hasHazard') === 'true') {
                currentContext.showHazard();
            } else {
                currentContext.$('#hazard-notification-container').addClass('hidden');
                currentContext.$('#hazard-detail-container').addClass('hidden');
                currentContext.$('#check-in-container').addClass('hidden');
                currentContext.$('#check-out-container').removeClass('hidden');
                currentContext.$('#open-check-in-container').addClass('hidden');
                currentContext.updateExpectedCheckOutLabel();
            }
            return this;
        },

        /**
         *
         * @returns {StationDetailView}
         */
        showGoToOpenCheckIn: function () {
            var currentContext = this;
            if (currentContext.model.has('hasHazard') && currentContext.model.get('hasHazard') === 'true') {
                currentContext.showHazard();
            } else {
                currentContext.$('#hazard-notification-container').addClass('hidden');
                currentContext.$('#hazard-detail-container').addClass('hidden');
                currentContext.$('#check-in-container').addClass('hidden');
                currentContext.$('#check-out-container').addClass('hidden');
                currentContext.$('#open-check-in-container').removeClass('hidden');
            }
            return this;
        },

        /**
         *
         * @param event
         * @returns {StationDetailView}
         */
        goToDirectionsWithLatLng: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var latitude = currentContext.model.get('latitude');
            var longitude = currentContext.model.get('longitude');
            currentContext.dispatcher.trigger(EventNameEnum.showProgressView);
            //currentContext.dispatcher.trigger(EventNameEnum.goToDirectionsWithLatLng, latitude, longitude);
            return this;
        },

        /**
         *
         * @param event
         * @returns {StationDetailView}
         */
        goToCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.dispatcher.trigger(EventNameEnum.goToCheckIn, currentContext.model.get('stationId'));
            return this;
        },

        /**
         *
         * @param event
         * @returns {StationDetailView}
         */
        goToCheckOut: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.dispatcher.trigger(EventNameEnum.goToCheckOut, currentContext.openStationEntryLogModel);
            return this;
        },

        /**
         *
         * @param event
         * @returns {StationDetailView}
         */
        goToStation: function (event) {
            if (event) {
                event.preventDefault();
                if (event.target) {
                    var currentContext = this;
                    var stationId = $(event.target).attr('data-station-id');
                    if (stationId) {
                        currentContext.dispatcher.trigger(EventNameEnum.goToStationWithId, stationId);
                    }
                }
            }
            return this;
        },
        /**
         *
         */
        onSync: function () {
            var currentContext = this;
            currentContext.$('.wait-for-loaded').addClass('hidden');
            currentContext.$('.station-detail-loading-image-container').removeClass('hidden');
        },

        /**
         *
         */
        onReset: function () {
            var currentContext = this;
            currentContext.$('.station-detail-loading-image-container').addClass('hidden');
            currentContext.$('.wait-for-loaded').removeClass('hidden');
        },

        /**
         *
         */
        onLoaded: function () {
            var currentContext = this;
            currentContext.$('.station-detail-loading-image-container').addClass('hidden');
            currentContext.$('.wait-for-loaded').removeClass('hidden');
            var options = {
                stationId: currentContext.model.get('stationId')
            };
            currentContext.updateViewFromModel();
            currentContext.updateCheckInControls();
            currentContext.dispatcher.trigger(EventNameEnum.refreshStationEntryLogCollection, currentContext.openStationEntryLogCollection, _.extend({}, options, {'open': true}));
            currentContext.dispatcher.trigger(EventNameEnum.refreshStationEntryLogCollection, currentContext.recentStationEntryLogCollection, _.extend({}, options, {'recent': true}));
            currentContext.dispatcher.trigger(EventNameEnum.refreshAbnormalConditionCollection, currentContext.abnormalConditionCollection, _.extend({}, options, {'open': true}));
            currentContext.dispatcher.trigger(EventNameEnum.refreshWarningCollection, currentContext.warningCollection, _.extend({}, options, {'active': true}));
        },

        /**
         *
         */
        onLeave: function () {
            var currentContext = this;
            console.trace('StationDetailView.onLeave');
        }
    });

    return StationDetailView;
});