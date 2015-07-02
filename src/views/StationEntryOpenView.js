define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            env = require('env'),
            template = require('hbs!templates/StationEntryOpen'),
            cicoEvents = require('cico-events');

    return CompositeView.extend({
        initialize: function(options) {
            console.debug('StationEntryOpenView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.stationModel = options.stationModel;
            this.stationEntryLogModel = options.stationEntryLogModel;
        },
        leave: function() {
            this.trigger('leave');
            this.unbind();
            this.stopListening();
            this.remove();
        },
        render: function() {
            console.debug('StationEntryOpenView.render');
            this.$el.html(template());
            this.updateViewFromModel();
            return this;
        },
        events: {
            'click #showCheckInModalBtn': 'showCheckInModal',
            'click #goToCheckedInStationBtn': 'goToCheckedInStation',
            'click #showExtendDurationModalBtn': 'showExtendDurationModal',
            'click #showCheckOutModalBtn': 'showCheckOutModal',
            'click #linked-site-redirect': 'goToLinkedStation'
        },
        showExtendDurationModal: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (!this.$('#showExtendDurationModalBtn').hasClass('disabled')) {
                cicoEvents.trigger(cicoEvents.goToExtendDuration, this.stationEntryLogModel);
            }
        },
        showCheckInModal: function(event) {
            if (event) {
                event.preventDefault();
            }

            if (!this.$('#showCheckInModalBtn').hasClass('disabled')) {
                cicoEvents.trigger(cicoEvents.goToCheckIn, this.stationModel);
            }
        },
        showCheckOutModal: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (!this.$('#showCheckOutModalBtn').hasClass('disabled')) {
                cicoEvents.trigger(cicoEvents.goToCheckOut, this.stationEntryLogModel);
            }
        },
        goToCheckedInStation: function(event) {
            if (event) {
                event.preventDefault();
            }

            if (!this.$('#goToCheckedInStationBtn').hasClass('disabled')) {
                var stationId = this.stationEntryLogModel.get('stationId');
                if (stationId) {
                    cicoEvents.trigger(cicoEvents.goToStationWithId, stationId);
                } else {
                    cicoEvents.trigger(cicoEvents.goToOpenCheckIn, this.stationEntryLogModel);
                }
            }
        },
        updateViewFromModel: function() {
            var currentContext = this;

            currentContext.hideStationEntryLoadingView();
            currentContext.updateExpectedCheckOutTime();
            if (this.stationEntryLogModel && this.stationEntryLogModel.get('stationId') && this.stationEntryLogModel.get('stationId').toString() === currentContext.stationModel.get('stationId')) {
                /* if station entry open stationId === parent view stationId, then show the check-out UI */
                currentContext.hideStationEntryActionViews();
                currentContext.showStationEntryCheckoutView();
                currentContext.showStationEntryExtendDurationView();
                currentContext.updateViewFromHazard('out');
            } else {
                if (this.stationEntryLogModel) {
                    /* if station entry open stationId !== parent view stationId, then show the go to checked-in station UI */
                    currentContext.hideStationEntryActionViews();
                    currentContext.showStationEntryAlreadyCheckedinView(this.stationEntryLogModel.get('stationName'));
                } else {
                    /* if station entry open is null, then show the check-in UI */
                    currentContext.hideStationEntryActionViews();
                    /* if linked station, display redirect message */
                    if (this.stationModel.has('linkedStationId') && this.stationModel.has('linkedStationName') && (this.stationModel.get('linkedStationName').length > 0)) {
                        this.$('.linked-station-name-text-link').text(this.stationModel.get('linkedStationName'));
                        currentContext.showLinkedStationRedirect();
                        if (this.stationModel.has('stationType') && this.stationModel.get('stationType') === 'TD') {
                            currentContext.showLinkedTDStationRedirect();
                        }
                        if (this.stationModel.has('stationType') && this.stationModel.get('stationType') === 'TC') {
                            currentContext.showLinkedTCStationRedirect();
                        }
                    }
                    currentContext.showStationEntryCheckinView();
                    currentContext.updateViewFromHazard('in');
                }
            }

            currentContext.trigger('loaded');
        },
        updateViewFromHazard: function(direction) {
            var whoToCall = 'dispatch desk';
            if (this.stationModel && this.stationModel.has('hasHazard') && this.stationModel.get('hasHazard')) {
                this.hideStationEntryActionViews();

                if (this.stationModel.has('linkedStationId') && this.stationModel.has('linkedStationName') && (this.stationModel.get('linkedStationName').length > 0)) {
                    this.$('.linked-station-name-text-link').text(this.stationModel.get('linkedStationName'));
                    this.showLinkedStationRedirect();
                    if (this.stationModel.has('stationType') && this.stationModel.get('stationType') === 'TD') {
                        this.showLinkedTDStationRedirect();
                    }
                    if (this.stationModel.has('stationType') && this.stationModel.get('stationType') === 'TC') {
                        whoToCall = 'NOC';
                        this.showLinkedTCStationRedirect();
                    }
                }

                this.showStationEntryErrorView('A hazard exists for this facility. You must call the ' + whoToCall + ' to check-' + direction + '.');
            }
        },
        updateExpectedCheckOutTime: function() {
            var expectedOutTimeStr = '';
            if (this.stationEntryLogModel) {
                expectedOutTimeStr = this.stationEntryLogModel.getExpectedCheckOutTimeString();
            }
            this.$('.expected-check-out-time').html(expectedOutTimeStr);
        },
        goToLinkedStation: function(event) {
            if (event) {
                event.preventDefault();
            }
            var linkedStationId = this.stationModel.get('linkedStationId');
            cicoEvents.trigger(cicoEvents.goToStationWithId, linkedStationId);
        },
        hideStationEntryActionViews: function() {
            this.hideStationEntryLoadingView();
            this.hideStationEntryCheckoutView();
            this.hideStationEntryExtendDurationView();
            this.hideStationEntryCheckinView();
            this.hideStationEntryAlreadyCheckedinView();
            this.hideStationEntryErrorView();
            this.hideLinkedStationRedirect();
            this.hideLinkedTDStationRedirect();
            this.hideLinkedTCStationRedirect();
        },
        showStationEntryLoadingView: function(message) {
            if (message) {
                this.$('.station-entry-loading-view .text-detail').html(message);
            }
            this.$('.station-entry-loading-view').removeClass('hidden');
        },
        hideStationEntryLoadingView: function() {
            this.$('.station-entry-loading-view').addClass('hidden');
        },
        showStationEntryCheckoutView: function() {
            this.$('.station-entry-check-out-view').removeClass('hidden');
        },
        hideStationEntryCheckoutView: function() {
            this.$('.station-entry-check-out-view').addClass('hidden');
        },
        showStationEntryExtendDurationView: function() {
            this.$('.station-entry-extend-duration-view').removeClass('hidden');
        },
        hideStationEntryExtendDurationView: function() {
            this.$('.station-entry-extend-duration-view').addClass('hidden');
        },
        showStationEntryCheckinView: function() {
            this.$('.station-entry-check-in-view').removeClass('hidden');
        },
        hideStationEntryCheckinView: function() {
            this.$('.station-entry-check-in-view').addClass('hidden');
        },
        showStationEntryAlreadyCheckedinView: function(stationName) {
            if (stationName) {
                this.$('#goToCheckedInStationBtn').attr('title', 'Go to ' + stationName);
            }
            this.$('.station-entry-already-checked-in-view').removeClass('hidden');
        },
        hideStationEntryAlreadyCheckedinView: function() {
            this.$('.station-entry-already-checked-in-view').addClass('hidden');
        },
        showStationEntryErrorView: function(message) {
            if (message) {
                this.$('.station-entry-error-view .text-detail').html(message);
            }
            this.$('.station-entry-error-view').removeClass('hidden');
        },
        hideStationEntryErrorView: function() {
            this.$('.station-entry-error-view').addClass('hidden');
        },
        showLinkedStationRedirect: function() {
            this.$('#linked-site-redirect').removeClass('hidden');
        },
        hideLinkedStationRedirect: function() {
            this.$('#linked-site-redirect').addClass('hidden');
        },
        showLinkedTDStationRedirect: function() {
            this.$('#linked-TD-site-redirect-text-div').removeClass('hidden');
        },
        hideLinkedTDStationRedirect: function() {
            this.$('#linked-TD-site-redirect-text-div').addClass('hidden');
        },
        showLinkedTCStationRedirect: function() {
            this.$('#linked-TC-site-redirect-text-div').removeClass('hidden');
        },
        hideLinkedTCStationRedirect: function() {
            this.$('#linked-TC-site-redirect-text-div').addClass('hidden');
        }
    });
});
