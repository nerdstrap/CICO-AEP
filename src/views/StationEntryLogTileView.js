define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var utils = require('utils');
    var template = require('hbs!templates/StationEntryLogTileView');

    var StationEntryLogTileView = BaseView.extend({

        initialize: function (options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.showPersonnel = options.showPersonnel;
            this.showStation = options.showStation;

            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },

        render: function () {
            this.setElement(template(this.renderModel(this.model)));
            this.updateViewFromModel();
            return this;
        },

        events: {
            'click .go-to-personnel-button': 'goToPersonnelDetailWithId',
            'click .go-to-station-button': 'goToStationDetailWithId'
        },

        updateViewFromModel: function () {
            this.updateIcons();
            this.updateGoToPersonnelButton();
            this.updateGoToStationButton();
            this.updatePurposeLabel();
            this.updateInTimeLabel();
            this.updateOutTimeLabel();
            this.updateAdditionalInfoLabel();
            return this;
        },

        updateIcons: function () {
            var withCrewState = !(this.model.has('withCrew') && this.model.get('withCrew') === true);
            this.$('.with-crew-icon').toggleClass('hidden', withCrewState);
            return this;
        },

        updateGoToPersonnelButton: function () {
            this.$('.go-to-personnel-button').toggleClass('hidden', !this.showPersonnel);
            if (this.model.has('userName')) {
                var userName = this.model.get('userName');
                this.$('.go-to-personnel-button').text(userName);
            }
            return this;
        },

        updateGoToStationButton: function () {
            this.$('.go-to-station-button').toggleClass('hidden', !this.showStation);
            if (this.model.has('stationName')) {
                var stationName = this.model.get('stationName');
                this.$('.go-to-station-button').text(stationName);
            } else {
                var adHocDescription = this.model.get('adHocDescription');
                this.$('.go-to-station-button').text(adHocDescription);
            }
            return this;
        },

        updatePurposeLabel: function () {
            var currentContext = this;
            if (this.model.has('purpose')) {
                var purpose = this.model.get('purpose');
                this.$('.purpose-label').text(purpose);
            }
            return this;
        },

        updateInTimeLabel: function () {
            var currentContext = this;
            if (this.model.has('inTime')) {
                var inTime = this.model.get('inTime');
                var formattedInTime = utils.formatDate(inTime);
                this.$('.in-time-label').text(formattedInTime);
            }

            return this;
        },

        updateOutTimeLabel: function () {
            var currentContext = this;
            if (this.model.has('outTime')) {
                var outTime = this.model.get('outTime');
                var formattedOutTime = utils.formatDate(outTime);
                this.$('.out-time-label').text(formattedOutTime);
                this.$('.in-time-out-time-separator').toggleClass('hidden', false);
            }

            return this;
        },

        updateAdditionalInfoLabel: function () {
            var currentContext = this;
            if (this.model.has('additionalInfo')) {
                var additionalInfo = this.model.get('additionalInfo');
                this.$('.additional-info-label').text(additionalInfo);
            }
            return this;
        },

        goToPersonnelDetailWithId: function (event) {
            var currentContext = this;
            if (event) {
                event.preventDefault();
            }
            var personnelId = this.model.get('personnelId');
            this.dispatcher.trigger(EventNameEnum.goToPersonnelDetailWithId, personnelId);
            return this;
        },

        goToStationDetailWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            var stationId = this.model.get('stationId');
            if (stationId) {
                this.dispatcher.trigger(EventNameEnum.goToStationDetailWithId, stationId);
            } else {
                var stationEntryLogId = this.model.get('stationEntryLogId');
                this.dispatcher.trigger(EventNameEnum.goToAdHocStationWithId, stationEntryLogId);
            }
            return this;
        }

    });

    return StationEntryLogTileView;
});