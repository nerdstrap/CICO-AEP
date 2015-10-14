'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');
var template = require('templates/StationTileView.hbs');

var StationTileView = BaseView.extend({

    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
        options || (options = {});
        this.dispatcher = options.dispatcher || this;
    },

    render: function () {
        this.setElement(template(this.renderModel(this.model)));
        this.updateViewFromModel();
        return this;
    },

    events: {
        'click [data-button="tile"]': 'tileClick',
        'click .go-to-directions-button': 'goToDirectionsWithLatLng'
    },

    updateViewFromModel: function () {
        this.updateIcons();
        this.updateStationNameLabel();
        this.updateDistanceLabel();
        this.updateDirectionsLink();
        return this;
    },

    updateIcons: function () {
        var hasHazard = this.model.get('hasHazard');
        this.$('.hazard-icon').toggleClass('hidden', (hasHazard !== true));
        var hasAbnormalConditions = this.model.get('hasAbnormalConditions');
        this.$('.abnormal-condition-icon').toggleClass('hidden', (hasAbnormalConditions !== true));
        var hasWarnings = this.model.get('hasWarnings');
        this.$('.warning-icon').toggleClass('hidden', (hasWarnings !== true));
        var hasOpenCheckIns = this.model.get('hasOpenCheckIns');
        this.$('.open-check-in-icon').toggleClass('hidden', (hasOpenCheckIns !== true));
        return this;
    },

    updateStationNameLabel: function () {
        var stationName = this.model.get('stationName');
        if (stationName) {
            this.$('.station-name-label').text(stationName);
        }
        return this;
    },

    updateDistanceLabel: function () {
        var distance = this.model.get('distance');
        if (distance) {
            var formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance.toFixed(2)]);
            this.$('.distance-label').text(formattedDistance);
        } else {
            var distanceUnavailableErrorMessage = utils.getResource('distanceUnavailableErrorMessageText');
            this.$('.distance-label').text(distanceUnavailableErrorMessage);
        }
        return this;
    },

    updateDirectionsLink: function () {
        var latitude = this.model.get('latitude');
        var longitude = this.model.get('longitude');
        var directionsLinkState = !(latitude && longitude);
        this.$('.distance-directions-separator').toggleClass('hidden', directionsLinkState);
        this.$('.go-to-directions-button').toggleClass('hidden', directionsLinkState);
        return this;
    },

    tileClick: function (event) {
        if (event) {
            var $target = $(event.target);

            if ($target.is('[data-button="tile"], [data-button="tile"] *') && !$target.is('[data-ignore="tile"], [data-ignore="tile"] *')) {
                this.goToStationDetails(event);
            }
        }
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

    goToStationDetails: function (event) {
        if (event) {
            event.preventDefault();
        }
        var stationId = this.model.get('stationId');
        this.dispatcher.trigger(EventNameEnum.goToStationDetails, stationId);
        return this;
    }
});

module.exports = StationTileView;