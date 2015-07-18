define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/AdHocStationView');

    /**
     * 
     * @type AdHocLandingView
     */
    var AdHocLandingView = BaseView.extend({
        /**
         * 
         */
        className: 'details-view ad-hoc-details-view',
        /**
         * 
         * @param {type} options
         */
        initialize: function(options) {
            console.debug('AdHocLandingView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.locationModel = CICOLocationModel.getInstance();
        },
        /**
         * 
         * @returns {AdHocLandingView}
         */
        render: function() {
            console.debug('AdHocLandingView.render');
            var currentContext = this;
            var renderModel = _.extend({}, this.model.attributes);
            currentContext.$el.html(template(renderModel));
            return this;
        },
        /**
         * 
         */
        events: {
            'click #showExtendDurationModalBtn': 'showExtendDurationModal',
            'click #showCheckOutModalBtn': 'showCheckOutModal',
            'click a.directions-text-link': 'goToDirections'
        },
        /**
         * 
         * @returns {AdHocLandingView}
         */
        updateViewFromModel: function() {
            var currentContext = this;
            var description;
            if (currentContext.model.has('description')) {
                description = currentContext.model.get('description');
            }
            this.updateExpectedCheckOutTime();
            currentContext.$('.ad-hoc-description').html(description);
            currentContext.setDistanceInMiles();
//            this.setDirectionLink();
            return this;
        },
        /**
         * 
         * @param {type} event
         * @returns {AdHocLandingView}
         */
        showExtendDurationModal: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.dispatcher.trigger('goToExtendDuration', currentContext.model);
            return this;
        },
        /**
         * 
         * @param {type} event
         * @returns {AdHocLandingView}
         */
        showCheckOutModal: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.dispatcher.trigger('goToCheckOut', currentContext.model);
            return this;
        },
        showLoading: function() {
            var currentContext = this;
            currentContext.$('.loading').removeClass('hidden');
            currentContext.$('.ad-hoc-primary-details').addClass('hidden');
            return this;
        },
        hideLoading: function() {
            var currentContext = this;
            currentContext.$('.loading').addClass('hidden');
            currentContext.$('.ad-hoc-primary-details').removeClass('hidden');
            return this;
        },
        updateExpectedCheckOutTime: function() {
            var expectedOutTimeStr = '';
            expectedOutTimeStr = this.model.getExpectedCheckOutTimeString();
            this.$('.expected-check-out-time').html(expectedOutTimeStr);
            this.$('.dispatch-phone').html(env.getFormattedPhoneNumberLink(this.model.get('stationPhone')));
        },
        setDirectionLink: function(stationEntryModel) {
            var currentContext = this;
            currentContext.setDistanceInMiles();
            currentContext.$('.station-distance-directions').html(gpsDistanceTemplate(stationEntryModel));
        },
        setDistanceInMiles: function() {
            var currentContext = this;
            if (currentContext.model.get('hasCoordinates')) {
                currentContext.locationModel.getCurrentPosition(
                        function(position) {
                            var distanceInMiles = currentContext.locationModel.calculateDistanceFromCurrentPosition(position.coords, currentContext.model.get('coords'));
                            var attribute = {};
                            attribute['distance'] = distanceInMiles;
                            currentContext.model.set(attribute);
                            currentContext.setDirectionLink(currentContext.model.attributes);
                        },
                        function(error) {
                        }
                );
            }
        },
        goToDirections: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger('goToAdhocDirections', this.model);
        }
    });

    return AdHocLandingView;
});
