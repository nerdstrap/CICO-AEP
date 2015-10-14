'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var StationTypeEnum = require('enums/StationTypeEnum');
var StationEntryLogCollection = require('collections/StationEntryLogCollection');
var AbnormalConditionCollection = require('collections/AbnormalConditionCollection');
var WarningCollection = require('collections/WarningCollection');
var StationEntryLogCollectionView = require('views/StationEntryLogCollectionView');
var WarningCollectionView = require('views/WarningCollectionView');
var AbnormalConditionCollectionView = require('views/AbnormalConditionCollectionView');
var utils = require('lib/utils');
var template = require('templates/StationDetailView.hbs');

var StationDetailView = BaseView.extend({

    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
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
            showStation: false,
            loadingMessageText: utils.getResource('openStationEntryLogCollectionLoadingMessageText'),
            errorMessageText: utils.getResource('openStationEntryLogCollectionErrorMessageText'),
            headerTextFormatString: utils.getResource('openStationEntryLogCollectionHeaderTextFormatString')
        });
        this.appendChildTo(this.openStationEntryLogCollectionViewInstance, '#open-station-entry-log-collection-view-container');
        return this;
    },

    renderRecentStationEntryLogCollectionView: function () {
        this.recentStationEntryLogCollectionViewInstance = new StationEntryLogCollectionView({
            dispatcher: this.dispatcher,
            collection: this.recentStationEntryLogCollection,
            showPersonnel: true,
            showStation: false,
            loadingMessageText: utils.getResource('recentStationEntryLogCollectionLoadingMessageText'),
            errorMessageText: utils.getResource('recentStationEntryLogCollectionErrorMessageText'),
            headerTextFormatString: utils.getResource('recentStationEntryLogCollectionHeaderTextFormatString')
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
        'click #go-to-parent-station-button': 'goToStationDetails',
        'click #go-to-child-station-button': 'goToStationDetails',
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
        var hasHazard = this.model.get('hasHazard');
        this.$('#station-hazard-icon').toggleClass('hidden', (hasHazard !== true));
        var hasAbnormalConditions = this.model.get('hasAbnormalConditions');
        this.$('#station-abnormal-condition-icon').toggleClass('hidden', (hasAbnormalConditions !== true));
        var hasWarnings = this.model.get('hasWarnings');
        this.$('#station-warning-icon').toggleClass('hidden', (hasWarnings !== true));
        var hasOpenCheckIns = this.model.get('hasOpenCheckIns');
        this.$('#station-open-check-in-icon').toggleClass('hidden', (hasOpenCheckIns !== true));
        return this;
    },

    updateStationNameHeader: function () {
        var stationName = this.model.get('stationName');
        if (stationName) {
            this.$('#station-name-header').text(stationName);
        }
        return this;
    },

    updateDistanceLabel: function () {
        var distance = this.model.get('distance');
        if (distance) {
            var formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance.toFixed(2)]);
            this.$('#station-distance-label').text(formattedDistance);
        } else {
            var distanceUnavailableErrorMessage = utils.getResource('distanceUnavailableErrorMessageText');
            this.$('#station-distance-label').text(distanceUnavailableErrorMessage);
        }
        return this;
    },

    updateDirectionsLink: function () {
        var latitude = this.model.get('latitude');
        var longitude = this.model.get('longitude');
        var directionsLinkState = !(latitude && longitude);
        this.$('#station-distance-directions-separator').toggleClass('hidden', directionsLinkState);
        this.$('#go-to-directions-button').toggleClass('hidden', directionsLinkState);
        return this;
    },

    updateLinkedStationLink: function () {
        this.$('.linked-station-container').addClass('hidden');
        var linkedStationId = this.model.get('linkedStationId');
        if (linkedStationId) {
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
                var stationEntryLogId = this.myOpenStationEntryLogModel.get('stationEntryLogId');
                if (stationEntryLogId) {
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
        this.dispatcher.trigger(EventNameEnum.goToEditCheckIn, stationEntryLogId);
        return this;
    },

    goToCheckOut: function (event) {
        if (event) {
            event.preventDefault();
        }
        var stationEntryLogId = this.myOpenStationEntryLogModel.get('stationEntryLogId');
        this.dispatcher.trigger(EventNameEnum.goToCheckOut, stationEntryLogId);
        return this;
    },

    goToOpenCheckIn: function (event) {
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

    goToStationDetails: function (event) {
        if (event) {
            event.preventDefault();
        }
        var linkedStationId = this.model.get('linkedStationId');
        this.dispatcher.trigger(EventNameEnum.goToStationDetails, linkedStationId);
        return this;
    },

    onLoaded: function () {
        this.updateViewFromModel();
        this.updateCheckInControls();
        this.showLoading();
        var stationId = this.model.get('stationId');
        var stationType = this.model.get('stationType');
        var options = {
            stationId: stationId
        };
        this.dispatcher.trigger(EventNameEnum.getOpenStationEntryLogs, this.openStationEntryLogCollection, _.extend({}, options));
        this.dispatcher.trigger(EventNameEnum.getRecentStationEntryLogs, this.recentStationEntryLogCollection, _.extend({}, options));
        if (stationType === StationTypeEnum.td) {
            this.$('#abnormal-condition-collection-view-container').toggleClass('hidden', false);
            this.$('#warning-collection-view-container').toggleClass('hidden', true);
            this.dispatcher.trigger(EventNameEnum.getAbnormalConditions, this.abnormalConditionCollection, _.extend({}, options));
        } else {
            this.$('#abnormal-condition-collection-view-container').toggleClass('hidden', true);
            this.$('#warning-collection-view-container').toggleClass('hidden', false);
            this.dispatcher.trigger(EventNameEnum.getWarnings, this.warningCollection, _.extend({}, options));
        }
    },

    onError: function (error) {
        this.showError(error);
    }
});

module.exports = StationDetailView;