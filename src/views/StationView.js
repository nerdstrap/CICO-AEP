define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var StationTypeEnum = require('enums/StationTypeEnum');
    var StationEntryLogCollection = require('collections/StationEntryLogCollection');
    var StationEntryLogCollectionView = require('views/StationEntryLogCollectionView');
    var AbnormalConditionCollection = require('collections/AbnormalConditionCollection');
    var AbnormalConditionCollectionView = require('views/AbnormalConditionCollectionView');
    var WarningCollection = require('collections/WarningCollection');
    var WarningCollectionView = require('views/WarningCollectionView');
    var template = require('hbs!templates/StationView');

    var StationView = BaseView.extend({
        /**
         * 
         * @param {type} options
         * @returns {undefined}
         */
        initialize: function(options) {
            console.debug('StationView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.settingsModel = options.settingsModel;
            this.myPersonnelModel = options.myPersonnelModel;
            this.openStationEntryLogModel = options.openStationEntryLogModel;
            this.openStationEntryLogCollection = options.openStationEntryLogCollection || new StationEntryLogCollection();
            this.recentStationEntryLogCollection = options.recentStationEntryLogCollection || new StationEntryLogCollection();
            this.abnormalConditionCollection = options.abnormalConditionCollection || new AbnormalConditionCollection();
            this.warningCollection = options.warningCollection || new WarningCollection();
            this.listenTo(this.dispatcher, EventNameEnum.checkInSuccess, this.onCheckInSuccess);
            this.listenTo(this.dispatcher, EventNameEnum.clearWarningSuccess, this.hideStationWarningIndicator);
            this.listenTo(this.dispatcher, EventNameEnum.addWarningSuccess, this.showStationWarningIndicator);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        
        /**
         * 
         * @returns {StationView}
         */
        render: function() {
            console.debug('StationView.render');
            var currentContext = this;
            currentContext.setElement(template());
            currentContext.renderOpenStationEntryLogCollectionView();
            currentContext.renderRecentStationEntryLogCollectionView();
            currentContext.renderAbnormalConditionCollectionView();
            currentContext.renderWarningCollectionView();
            return this;
        },
        
        /**
         * 
         * @returns {StationView}
         */
        renderOpenStationEntryLogCollectionView: function() {
            var currentContext = this;
            this.openStationEntryLogCollectionView = new StationEntryLogCollectionView({
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationEntryLogCollection
            });
            this.renderChildInto(this.openStationEntryLogCollectionView, '.stationCheckIns.open');
            return this;
        },
        
        /**
         * 
         * @returns {StationView}
         */
        renderRecentStationEntryLogCollectionView: function() {
            var currentContext = this;
            this.recentStationEntryLogCollectionView = new StationEntryLogCollectionView({
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationEntryLogCollection
            });
            this.renderChildInto(this.recentStationEntryLogCollectionView, '.stationCheckIns.recent');
            return this;
        },
        
        /**
         * 
         * @returns {StationView}
         */
        renderAbnormalConditionCollectionView: function() {
            var currentContext = this;
            if (this.model.get('stationType') === StationTypeEnum.td) {
                this.abnormalConditionCollectionView = new AbnormalConditionCollectionView({
                    dispatcher: currentContext.dispatcher,
                    el: $('#stationAbnormalConditions', currentContext.$el),
                    collection: currentContext.abnormalConditionCollection,
                    myPersonnelModel: currentContext.myPersonnelModel
                });
                this.renderChild(this.abnormalConditionCollectionView);
            }
            return this;
        },
        
        /**
         * 
         * @returns {StationView}
         */
        renderWarningCollectionView: function() {
            var currentContext = this;
            if (this.model.get('stationType') === StationTypeEnum.tc) {
                this.warningCollectionView = new WarningCollectionView({
                    dispatcher: currentContext.dispatcher,
                    collection: currentContext.warningCollection
                });
                this.renderChildInto(this.warningCollectionView, '#stationWarnings');
            }
            return this;
        },
        
        /**
         * 
         */
        events: {
            'click a.directions-text-link': 'goToDirections',
            'click #linked-site-redirect': 'goToLinkedStation',
            'click #showCheckInModalBtn': 'showCheckInModal',
            'click #goToCheckedInStationBtn': 'goToCheckedInStation',
            'click #showExtendDurationModalBtn': 'showExtendDurationModal',
            'click #showCheckOutModalBtn': 'showCheckOutModal',
            'click a.sectionButton': 'sectionClick'
        },
        
        /**
         * 
         */
        goToLinkedStation: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var linkedStationId = this.model.get('linkedStationId');
            currentContext.dispatcher.trigger(EventNameEnum.goToStationWithId, linkedStationId);
        },
        showExtendDurationModal: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            if (!this.$('#showExtendDurationModalBtn').hasClass('disabled')) {
                currentContext.dispatcher.trigger(EventNameEnum.goToExtendDuration, this.openStationEntryLogModel);
            }
        },
        showCheckInModal: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            if (!this.$('#showCheckInModalBtn').hasClass('disabled')) {
                currentContext.dispatcher.trigger(EventNameEnum.goToCheckIn, this.model);
            }
        },
        showCheckOutModal: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            if (!this.$('#showCheckOutModalBtn').hasClass('disabled')) {
                currentContext.dispatcher.trigger(EventNameEnum.goToCheckOut, this.openStationEntryLogModel);
            }
        },
        goToCheckedInStation: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            if (!this.$('#goToCheckedInStationBtn').hasClass('disabled')) {
                var stationId = this.openStationEntryLogModel.get('stationId');
                if (stationId) {
                    currentContext.dispatcher.trigger(EventNameEnum.goToStationWithId, stationId);
                } else {
                    currentContext.dispatcher.trigger(EventNameEnum.goToAdHocStationWithId, this.openStationEntryLogModel);
                }
            }
        },
        sectionClick: function(event) {
            var currentContext = this;
            if ($(event.target).closest('section').hasClass('disabled')) {
                return false;
            }
            else {
                $('html, body').animate({
                    scrollTop: $(event.target).closest('section').offset().top
                }, 250);
            }
        },
        updateCheckInControls: function() {
            var currentContext = this;
            this.openStationEntryLogView = new StationEntryOpenView({
                dispatcher: currentContext.dispatcher,
                stationModel: currentContext.model,
                stationEntryLogModel: currentContext.openStationEntryLogModel
            });
            this.renderChildInto(this.openStationEntryLogView, '#stationEntryOpenView');
            return this;
        },
        updateIndicators: function() {
            if (this.model.has('hasHazard') && this.model.get('hasHazard')) {
                this.$('.hazard-text-icon').removeClass('hidden');
                var hazardModel = _.extend({}, this.model.attributes, this.getDefaultsForRendering());
                this.$('#stationHazard').html(stationHazardTemplate(hazardModel));
            }
            if (this.model.has('hasWarnings') && this.model.get('hasWarnings')) {
                this.$('.warning-text-icon').removeClass('hidden');
            }
        },
        updateViewFromModel: function() {
            var currentContext = this;
            if (this.model.has('stationType') && this.model.get('stationType') === 'TC') {
                this.$('.telecom-text-icon').removeClass('hidden');
                if (this.model.has("linkedStationId") && this.model.has('linkedStationName') && (this.model.get('linkedStationName').length > 0)) {
                    this.$('.linked-station-text-icon').removeClass('hidden');
                }
                this.$('.distribution-dispatch-center').addClass('hidden');
                this.$('.transmission-dispatch-center').addClass('hidden');
                this.$('.noc-dispatch-center').removeClass('hidden');
            }

            if (this.model.get('hasCoordinates')) {
                this.locationModel.getCurrentPosition(
                        function(position) {
                            var distanceInMiles = currentContext.locationModel.calculateDistanceFromCurrentPosition(position.coords, currentContext.model.get('coords'));
                            currentContext.model.set('distanceInMiles', distanceInMiles);
                            currentContext.updateViewFromModelAfterGps();
                        },
                        function() {
                            currentContext.updateViewFromModelAfterGps();
                        }
                );
            } else {
                currentContext.updateViewFromModelAfterGps();
            }
        },
        updateViewFromModelAfterGps: function() {
            this.$('.station-name').html(this.model.get('stationName'));
            this.setDispatchCenterDetails(
                    '.transmission-dispatch-center',
                    this.model.get('transmissionDispatchCenterId'),
                    this.model.get('transmissionDispatchCenterName'),
                    this.model.get('transmissionDispatchCenterPhone'));
            this.setDispatchCenterDetails(
                    '.distribution-dispatch-center',
                    this.model.get('distributionDispatchCenterId'),
                    this.model.get('distributionDispatchCenterName'),
                    this.model.get('distributionDispatchCenterPhone'));
            this.setDispatchCenterDetails(
                    '.noc-dispatch-center',
                    this.model.get('nocDispatchCenterId'),
                    this.model.get('nocDispatchCenterName'),
                    this.model.get('nocDispatchCenterPhone'));
            var renderModel = _.extend({}, this.model.attributes, this.getDefaultsForRendering());
            this.$('#stationData').html(stationDataTemplate(renderModel));
            this.updateIndicators();
            this.setDirectionLink();
            this.showDispatchCenterIndicator();
        },
        showDispatchCenterIndicator: function() {
            if (this.openStationEntryLogModel) {
                if (this.openStationEntryLogModel
                        && this.openStationEntryLogModel.get('stationId')
                        && this.openStationEntryLogModel.get('stationId').toString() === this.model.get('stationId')
                        ) {
                    this.$('.dcSection[data-dcid="' + this.openStationEntryLogModel.get('dcId') + '"] .indicator').removeClass('hidden');
                }
            }
        },
        setDispatchCenterDetails: function(containerSelector, id, name, phone) {
            var container = this.$(containerSelector);
            container.attr('data-dcid', id);
            $('.dispatch-center', container).html(name);
            $('.dispatch-center', containerSelector).html(name);
            if (phone) {
                $('.dispatch-phone', container).html(env.getFormattedPhoneNumberLink(phone));
                $('.dispatch-phone', containerSelector).html(env.getFormattedPhoneNumberLink(phone));
            }
        },
        refreshOpenStationEntryLogCollection: function() {
            var currentContext = this;
            var stationId = currentContext.model.get('stationId');
            var stationType = currentContext.model.get('stationType');
            var options = {
                stationId: stationId,
                stationType: stationType,
                open: true
            };
            currentContext.dispatcher.trigger(EventNameEnum.refreshStationEntryLogCollection, currentContext.openStationEntryLogCollection, options);
        },
        refreshRecentStationEntryLogCollection: function() {
            var currentContext = this;
            var stationId = currentContext.model.get('stationId');
            var stationType = currentContext.model.get('stationType');
            var options = {
                stationId: stationId,
                stationType: stationType,
                recent: true
            };
            currentContext.dispatcher.trigger(EventNameEnum.refreshStationEntryLogCollection, currentContext.recentStationEntryLogCollection, options);
        },
        refreshAbnormalConditionCollection: function() {
            var currentContext = this;
            if (currentContext.model.get('stationType') === StationTypeEnum.td) {
                var stationId = currentContext.model.get('stationId');
                currentContext.dispatcher.trigger(EventNameEnum.refreshAbnormalConditionCollection, currentContext.abnormalConditionCollection, {stationId: stationId});
            }
        },
        refreshWarningCollection: function() {
            var currentContext = this;
            if (this.model.get('stationType') === StationTypeEnum.tc) {
                var stationId = currentContext.model.get('stationId');
                currentContext.dispatcher.trigger(EventNameEnum.refreshWarningCollection, currentContext.warningCollection, {stationId: stationId});
            }
        },
        goToDirections: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            this.dispatcher.trigger(EventNameEnum.goToDirectionsWithLatLng, latitude, longitude);
        },
        onAddWarningSuccess: function() {
            var currentContext = this;
            this.$('.warning-text-icon').addClass('hidden');
        },
        onClearWarningSuccess: function() {
            var currentContext = this;
            this.$('.warning-text-icon').removeClass('hidden');
        },
        onLoaded: function() {
            var currentContext = this;
            this.$('.station-loading-indicator').hide();
            this.updateViewFromModel();
            this.refreshOpenStationEntryLogCollection();
            this.refreshRecentStationEntryLogCollection();
            this.refreshAbnormalConditionCollection();
            this.refreshWarningCollection();
        },
        onLeave: function() {
            var currentContext = this;
        }
    });
    return StationView;
});