define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseDetailView = require('views/BaseDetailView');
    var EventNameEnum = require('enums/EventNameEnum');
    var StationTypeEnum = require('enums/StationTypeEnum');
    var StationEntryLogCollection = require('collections/StationEntryLogCollection');
    var AbnormalConditionCollection = require('collections/AbnormalConditionCollection');
    var WarningCollection = require('collections/WarningCollection');
    var StationEntryLogCollectionView = require('views/StationEntryLogCollectionView');
    var WarningCollectionView = require('views/WarningCollectionView');
    var AbnormalConditionCollectionView = require('views/AbnormalConditionCollectionView');
    var utils = require('utils');
    var template = require('hbs!templates/StationDetailView');

    var StationDetailView = BaseDetailView.extend({

        initialize: function (options) {
            BaseDetailView.prototype.initialize.apply(this, arguments);
            options || (options = {});
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

            this.myPersonnelModel = options.myPersonnelModel;
            this.myOpenStationEntryLogModel = options.myOpenStationEntryLogModel;

            this.openStationEntryLogCollection = options.openStationEntryLogCollection || new StationEntryLogCollection();
            this.recentStationEntryLogCollection = options.recentStationEntryLogCollection || new StationEntryLogCollection();
            this.abnormalConditionCollection = options.abnormalConditionCollection || new AbnormalConditionCollection();
            this.warningCollection = options.warningCollection || new WarningCollection();

            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'error', this.onError);
        },

        render: function () {
            this.setElement(template(this.renderModel(this.model)));
            this.renderOpenStationEntryLogCollectionView();
            this.renderRecentStationEntryLogCollectionView();
            this.renderAbnormalConditionCollectionView();
            this.renderWarningCollectionView();
            return this;
        },

        renderOpenStationEntryLogCollectionView: function () {
            this.openStationEntryLogCollectionViewInstance = new StationEntryLogCollectionView({
                dispatcher: this.dispatcher,
                collection: this.openStationEntryLogCollection,
                showPersonnel: true,
                showStation: false
            });
            this.appendChildTo(this.openStationEntryLogCollectionViewInstance, '#open-station-entry-log-collection-view-container');
            return this;
        },

        renderRecentStationEntryLogCollectionView: function () {
            this.recentStationEntryLogCollectionViewInstance = new StationEntryLogCollectionView({
                dispatcher: this.dispatcher,
                collection: this.recentStationEntryLogCollection,
                showPersonnel: true,
                showStation: false
            });
            this.appendChildTo(this.recentStationEntryLogCollectionViewInstance, '#recent-station-entry-log-collection-view-container');
            return this;
        },

        renderAbnormalConditionCollectionView: function () {
            this.abnormalConditionCollectionViewInstance = new AbnormalConditionCollectionView({
                dispatcher: this.dispatcher,
                collection: this.abnormalConditionCollection
            });
            this.appendChildTo(this.abnormalConditionCollectionViewInstance, '#abnormal-condition-collection-view-container');
            return this;
        },

        renderWarningCollectionView: function () {
            this.warningCollectionViewInstance = new WarningCollectionView({
                dispatcher: this.dispatcher,
                collection: this.warningCollection
            });
            this.appendChildTo(this.warningCollectionViewInstance, '#warning-collection-view-container');
            return this;
        },

        events: {
            'click #go-to-directions-button': 'goToDirectionsWithLatLng',
            'click #go-to-check-in-button': 'goToCheckIn',
            'click #go-to-edit-check-in-button': 'goToEditCheckIn',
            'click #go-to-check-out-button': 'goToCheckOut',
            'click #go-to-open-check-in-button': 'goToOpenCheckIn',
            'click #go-to-parent-station-button': 'goToStationDetailWithId',
            'click #go-to-child-station-button': 'goToStationDetailWithId',
            'click [data-toggle="panel"]': 'togglePanel'
        },

        updateViewFromModel: function () {
            this.updateIcons();
            this.updateStationNameHeader();
            this.updateDistanceLabel();
            this.updateDirectionsLink();
            this.updateLinkedStationLink();
            this.updateDispatcherPhoneLabels();
            this.updateStationDetailLabels();
            return this;
        },

        updateIcons: function () {
            var hazardIconState = !(this.model.get('hasHazard') === true);
            this.$('#station-hazard-icon').toggleClass('hidden', hazardIconState);

            var abnormalConditionIconState = !(this.model.get('hasAbnormalConditions') === true);
            this.$('#station-abnormal-condition-icon').toggleClass('hidden', abnormalConditionIconState);

            var warningIconState = !(this.model.get('hasWarnings') === true);
            this.$('#station-warning-icon').toggleClass('hidden', warningIconState);

            var openCheckInIconState = !(this.model.get('hasOpenCheckIns') === true);
            this.$('#station-open-check-in-icon').toggleClass('hidden', openCheckInIconState);

            return this;
        },

        updateStationNameHeader: function () {
            if (this.model.has('stationName')) {
                var stationName = this.model.get('stationName');
                this.$('#station-name-header').text(stationName);
            }
            return this;
        },

        updateDistanceLabel: function () {
            if (this.model.has('distance')) {
                var distance = this.model.get('distance').toFixed(2);
                var formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance]);
                this.$('#station-distance-label').text(formattedDistance);
            } else {
                var distanceUnavailableErrorMessage = utils.getResource('distanceUnavailableErrorMessage');
                this.$('#station-distance-label').text(distanceUnavailableErrorMessage);
            }
            return this;
        },

        updateDirectionsLink: function () {
            var directionsLinkState = !(this.model.has('latitude') && this.model.has('longitude'));
            this.$('#station-distance-directions-separator').toggleClass('hidden', directionsLinkState);
            this.$('#go-to-directions-button').toggleClass('hidden', directionsLinkState);
            return this;
        },

        updateLinkedStationLink: function () {
            this.$('.linked-station-container').addClass('hidden');
            if (this.model.has('linkedStationId')) {
                if (this.model.get('stationType') === StationTypeEnum.tc) {
                    this.$('#go-to-parent-station-button').text(this.model.get('linkedStationName'));
                    this.$('#parent-station-container').removeClass('hidden');
                    this.$('#child-station-container').addClass('hidden');
                } else {
                    this.$('#go-to-child-station-button').text(this.model.get('linkedStationName'));
                    this.$('#parent-station-container').addClass('hidden');
                    this.$('#child-station-container').removeClass('hidden');
                }
            }
            return this;
        },

        updateDispatcherPhoneLabels: function () {
            this.$('.dispatch-center-container').addClass('hidden');

            if (this.model.get('stationType') === StationTypeEnum.tc) {
                this.$('#network-operations-center-container').removeClass('hidden');
                this.$('#network-operations-center-name-label').text(this.model.get('networkOperationsCenterName'));
                this.$('#network-operations-center-phone-label').text(utils.formatPhone(this.model.get('networkOperationsCenterPhone')));
            } else {
                this.$('#transmission-dispatch-center-container').removeClass('hidden');
                this.$('#distribution-dispatch-center-container').removeClass('hidden');

                this.$('#transmission-dispatch-center-name-label').text(this.model.get('transmissionDispatchCenterName'));
                this.$('#transmission-dispatch-center-phone-label').text(utils.formatPhone(this.model.get('transmissionDispatchCenterPhone')));

                this.$('#distribution-dispatch-center-name-label').text(this.model.get('distributionDispatchCenterName'));
                this.$('#distribution-dispatch-center-phone-label').text(utils.formatPhone(this.model.get('distributionDispatchCenterPhone')));
            }
            return this;
        },

        updateDispatcherCheckInIcon: function () {
            this.$(utils.getResource('checkIcon')).addClass('hidden');
            if (this.model.get('stationType') === StationTypeEnum.tc) {
                this.$('#network-operations-center-check-in-icon').removeClass('hidden');
            } else {
                if (this.myOpenStationEntryLogModel.get('dispatchCenterId') === this.model.get('transmissionDispatchCenterId')) {
                    this.$('#transmission-dispatch-center-check-in-icon').removeClass('hidden');
                } else {
                    this.$('#distribution-dispatch-center-check-in-icon').removeClass('hidden');
                }
            }
            return this;
        },

        updateStationDetailLabels: function () {
            this.$('#phone-label').text(this.model.get('phone'));
            this.$('#radio-channel-label').text(this.model.get('radioChannel'));
            this.$('#emergency-contacts-label').text(this.model.get('emergencyContacts'));
            this.$('#city-label').text(this.model.get('city'));
            this.$('#county-label').text(this.model.get('county'));
            this.$('#state-label').text(this.model.get('state'));
            this.$('#lat-lng-label').text(this.model.get('latitude') + ',' + this.model.get('longitude'));
            this.$('#directions-label').text(this.model.get('directions'));
            this.$('#additional-data-label').text(this.model.get('additionalData'));
            return this;
        },

        updateCheckInControls: function () {
            if (this.model.get('hasHazard') === true) {
                this.showHazard();
            } else {
                if (this.myOpenStationEntryLogModel) {
                    if (this.myOpenStationEntryLogModel.has('stationEntryLogId')) {
                        if (this.myOpenStationEntryLogModel.get('stationId') === this.model.get('stationId')) {
                            this.showCheckOut();
                        } else {
                            this.showGoToOpenCheckIn();
                        }
                    } else {
                        this.showCheckIn();
                    }
                }
            }

            return this;
        },

        showHazard: function () {
            this.$('#hazard-notification-container').removeClass('hidden');
            this.$('#hazard-detail-container').removeClass('hidden');
            this.$('#check-in-container').addClass('hidden');
            this.$('#check-out-container').addClass('hidden');
            this.$('#open-check-in-container').addClass('hidden');
            return this;
        },

        showCheckIn: function () {
            var currentContext = this;
            this.$('#hazard-notification-container').addClass('hidden');
            this.$('#hazard-detail-container').addClass('hidden');
            this.$('#check-in-container').removeClass('hidden');
            this.$('#check-out-container').addClass('hidden');
            this.$('#open-check-in-container').addClass('hidden');
            return this;
        },

        showCheckOut: function () {
            var currentContext = this;
            this.$('#hazard-notification-container').addClass('hidden');
            this.$('#hazard-detail-container').addClass('hidden');
            this.$('#check-in-container').addClass('hidden');
            this.$('#check-out-container').removeClass('hidden');
            this.$('#open-check-in-container').addClass('hidden');
            this.updateExpectedCheckOutLabel();
            this.updateDispatcherCheckInIcon();
            return this;
        },

        updateExpectedCheckOutLabel: function () {
            if (this.myOpenStationEntryLogModel) {
                var expectedOutTime = this.myOpenStationEntryLogModel.get('expectedOutTime');
                var formattedExpectedOutTime = utils.formatDate(expectedOutTime);
                var formattedExpectedCheckOutText = utils.formatString(utils.getResource('expectedCheckOutTextFormatString'), [formattedExpectedOutTime]);
                this.$('#expected-check-out-label').text(formattedExpectedCheckOutText);
            }
            return this;
        },

        showGoToOpenCheckIn: function () {
            this.$('#hazard-notification-container').addClass('hidden');
            this.$('#hazard-detail-container').addClass('hidden');
            this.$('#check-in-container').addClass('hidden');
            this.$('#check-out-container').addClass('hidden');
            this.$('#open-check-in-container').removeClass('hidden');
            return this;
        },

        goToDirectionsWithLatLng: function (event) {
            if (event) {
                event.preventDefault();
            }
            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            this.dispatcher.trigger(EventNameEnum.goToDirectionsWithLatLng, latitude, longitude);
            return this;
        },

        goToCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            var stationId = this.model.get('stationId');
            this.dispatcher.trigger(EventNameEnum.goToCheckIn, stationId);
            return this;
        },

        goToEditCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            var stationEntryLogId = this.myOpenStationEntryLogModel.get('stationEntryLogId');
            var stationId = this.myOpenStationEntryLogModel.get('stationId');
            this.dispatcher.trigger(EventNameEnum.goToEditCheckIn, stationEntryLogId, stationId);
            return this;
        },

        goToCheckOut: function (event) {
            if (event) {
                event.preventDefault();
            }
            var stationEntryLogId = this.myOpenStationEntryLogModel.get('stationEntryLogId');
            var stationId = this.myOpenStationEntryLogModel.get('stationId');
            this.dispatcher.trigger(EventNameEnum.goToCheckOut, stationEntryLogId, stationId);
            return this;
        },

        goToOpenCheckIn: function (event) {
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

        goToStationDetailWithId: function (event) {
            if (event) {
                event.preventDefault();
            }
            var linkedStationId = this.model.get('linkedStationId');
            this.dispatcher.trigger(EventNameEnum.goToStationDetailWithId, linkedStationId);
            return this;
        },

        onLoaded: function () {
            this.updateViewFromModel();
            this.updateCheckInControls();
            this.showLoading();
            var options = {
                stationId: this.model.get('stationId')
            };
            this.dispatcher.trigger(EventNameEnum.refreshStationEntryLogCollection, this.openStationEntryLogCollection, _.extend({}, options, {open: true}));
            this.dispatcher.trigger(EventNameEnum.refreshStationEntryLogCollection, this.recentStationEntryLogCollection, _.extend({}, options, {recent: true}));
            this.dispatcher.trigger(EventNameEnum.getAbnormalConditionsByStationId, this.abnormalConditionCollection, _.extend({}, options, {open: true}));
            this.dispatcher.trigger(EventNameEnum.getWarningsByStationId, this.warningCollection, _.extend({}, options, {active: true}));
        },

        onError: function (error) {
            this.showError(error);
        }
    });

    return StationDetailView;
});