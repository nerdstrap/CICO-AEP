define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var utils = require('utils');
    var template = require('hbs!templates/StationTileView');

    var StationTileView = BaseView.extend({
        /**
         *
         * @param options
         */
        initialize: function(options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        /**
         *
         * @returns {StationTileView}
         */
        render: function() {
            var currentContext = this;
            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.setElement(template(renderModel));
            currentContext.updateViewFromModel();
            return this;
        },
        
        /**
         *
         */
        events: {
            'click .go-to-directions-button': 'goToDirectionsWithLatLng',
            'click .go-to-station-button': 'goToStationWithId'
        },
        
        /**
         *
         * @returns {StationTileView}
         */
        updateViewFromModel: function() {
            var currentContext = this;
            currentContext.updateIcons();
            currentContext.updateStationNameLabel();
            currentContext.updateDistanceLabel();
            return this;
        },
        
        /**
         *
         * @returns {StationTileView}
         */
        updateIcons: function() {
            var currentContext = this;

            if (currentContext.model.has('hasHazard') && currentContext.model.get('hasHazard') === true) {
                currentContext.$('.hazard-icon').removeClass('hidden');
            } else {
                currentContext.$('.hazard-icon').addClass('hidden');
            }

            if (currentContext.model.has('hasAbnormalConditions') && currentContext.model.get('hasAbnormalConditions') === true) {
                currentContext.$('.abnormal-condition-icon').removeClass('hidden');
            } else {
                currentContext.$('.abnormal-condition-icon').addClass('hidden');
            }

            if (currentContext.model.has('hasWarnings') && currentContext.model.get('hasWarnings') === true) {
                currentContext.$('.warning-icon').removeClass('hidden');
            } else {
                currentContext.$('.warning-icon').addClass('hidden');
            }

            if (currentContext.model.has('hasOpenCheckIns') && currentContext.model.get('hasOpenCheckIns') === true) {
                currentContext.$('.open-check-in-icon').removeClass('hidden');
            } else {
                currentContext.$('.open-check-in-icon').addClass('hidden');
            }

            return this;
        },
        
        /**
         *
         * @returns {StationTileView}
         */
        updateStationNameLabel: function() {
            var currentContext = this;
            if (currentContext.model.has('stationName')) {
                var stationName = currentContext.model.get('stationName');
                currentContext.$('.station-name-label').html(stationName);
            }
            return this;
        },
        
        /**
         *
         * @returns {StationTileView}
         */
        updateDistanceLabel: function() {
            var currentContext = this;
            var formattedDistance;
            if (currentContext.model.has('distance') && currentContext.model.has('latitude') && currentContext.model.has('longitude')) {
                currentContext.hasCoordinates = true;
                var distance = currentContext.model.get('distance').toFixed(2);
                formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance]);
            } else {
                formattedDistance = utils.getResource('coordinatesUnavailableErrorMessage');
            }
            currentContext.$('.distance-label').html(formattedDistance);
            return this;
        },
        
        /**
         *
         * @param event
         * @returns {StationTileView}
         */
        goToDirectionsWithLatLng: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            currentContext.dispatcher.trigger(EventNameEnum.goToDirectionsWithLatLng, latitude, longitude);
            return this;
        },
        
        /**
         *
         * @param event
         * @returns {StationTileView}
         */
        goToStationWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var stationId = this.model.get('stationId');
            currentContext.dispatcher.trigger(EventNameEnum.goToStationWithId, stationId);
            return this;
        },
        
        /**
         * 
         */
        onLoaded: function() {
            console.trace('StationTileView.onLoaded');
        },
        
        /**
         * 
         */
        onLeave: function() {
            console.trace('StationTileView.onLeave');
        }
    });

    return StationTileView;
});