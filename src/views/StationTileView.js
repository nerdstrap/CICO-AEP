define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var utils = require('utils');
    var template = require('hbs!templates/StationTileView');

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
            var hazardIconState = !(this.model.get('hasHazard') === true);
            this.$('.hazard-icon').toggleClass('hidden', hazardIconState);

            var abnormalConditionIconState = !(this.model.get('hasAbnormalConditions') === true);
            this.$('.abnormal-condition-icon').toggleClass('hidden', abnormalConditionIconState);

            var warningIconState = !(this.model.get('hasWarnings') === true);
            this.$('.warning-icon').toggleClass('hidden', warningIconState);

            var openCheckInIconState = !(this.model.get('hasOpenCheckIns') === true);
            this.$('.open-check-in-icon').toggleClass('hidden', openCheckInIconState);

            return this;
        },

        updateStationNameLabel: function () {
            if (this.model.has('stationName')) {
                var stationName = this.model.get('stationName');
                this.$('.station-name-label').text(stationName);
            }
            return this;
        },

        updateDistanceLabel: function () {
            if (this.model.has('distance')) {
                var distance = this.model.get('distance').toFixed(2);
                var formattedDistance = utils.formatString(utils.getResource('distanceFormatString'), [distance]);
                this.$('.distance-label').text(formattedDistance);
            } else {
                var distanceUnavailableErrorMessage = utils.getResource('distanceUnavailableErrorMessage');
                this.$('.distance-label').text(distanceUnavailableErrorMessage);
            }
            return this;
        },

        updateDirectionsLink: function () {
            var directionsLinkState = !(this.model.has('latitude') && this.model.has('longitude'));
            this.$('.distance-directions-separator').toggleClass('hidden', directionsLinkState);
            this.$('.go-to-directions-button').toggleClass('hidden', directionsLinkState);
            return this;
        },

        tileClick: function (event) {
            if (event) {
                var $target = $(event.target);

                if ($target.is('[data-button="tile"], [data-button="tile"] *') && !$target.is('[data-ignore="tile"], [data-ignore="tile"] *')) {
                    this.goToStationDetailWithId(event);
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

        goToStationDetailWithId: function (event) {
            if (event) {
                event.preventDefault();
            }
            var stationId = this.model.get('stationId');
            this.dispatcher.trigger(EventNameEnum.goToStationDetailWithId, stationId);
            return this;
        }
    });

    return StationTileView;
});