'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');
var template = require('templates/StationEntryLogTileView.hbs');

var StationEntryLogTileView = BaseView.extend({

    initialize: function (options) {
        options || (options = {});
        this.dispatcher = options.dispatcher || this;
        this.showPersonnel = options.showPersonnel;
        this.showStation = options.showStation;
    },

    render: function () {
        this.setElement(template(this.renderModel(this.model)));
        this.updateViewFromModel();
        return this;
    },

    events: {
        'click .go-to-personnel-button': 'goToPersonnelDetails',
        'click .go-to-station-button': 'goToStationDetails'
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
        var withCrew = this.model.get('withCrew');
        this.$('.with-crew-icon').toggleClass('hidden', (withCrew === true));
        return this;
    },

    updateGoToPersonnelButton: function () {
        this.$('.go-to-personnel-button').toggleClass('hidden', !this.showPersonnel);
        var userName = this.model.get('userName');
        if (userName) {
            this.$('.go-to-personnel-button').text(userName);
        }
        return this;
    },

    updateGoToStationButton: function () {
        this.$('.go-to-station-button').toggleClass('hidden', !this.showStation);
        var stationName = this.model.get('stationName');
        if (stationName) {
            this.$('.go-to-station-button').text(stationName);
        } else {
            var adHocDescription = this.model.get('adHocDescription');
            this.$('.go-to-station-button').text(adHocDescription);
        }
        return this;
    },

    updatePurposeLabel: function () {
        var purpose = this.model.get('purpose');
        if (purpose) {
            this.$('.purpose-label').text(purpose);
        }
        return this;
    },

    updateInTimeLabel: function () {
        var inTime = this.model.get('inTime');
        if (inTime) {
            var formattedInTime = utils.formatDate(inTime);
            this.$('.in-time-label').text(formattedInTime);
        }

        return this;
    },

    updateOutTimeLabel: function () {
        var outTime = this.model.get('outTime');
        if (outTime) {
            var formattedOutTime = utils.formatDate(outTime);
            this.$('.out-time-label').text(formattedOutTime);
            this.$('.in-time-out-time-separator').toggleClass('hidden', false);
        }

        return this;
    },

    updateAdditionalInfoLabel: function () {
        var additionalInfo = this.model.get('additionalInfo');
        if (additionalInfo) {
            this.$('.additional-info-label').text(additionalInfo);
        }
        return this;
    },

    goToPersonnelDetails: function (event) {
        if (event) {
            event.preventDefault();
        }
        var personnelId = this.model.get('personnelId');
        this.dispatcher.trigger(EventNameEnum.goToPersonnelDetails, personnelId);
        return this;
    },

    goToStationDetails: function (event) {
        if (event) {
            event.preventDefault();
        }
        var stationId = this.model.get('stationId');
        if (stationId) {
            this.dispatcher.trigger(EventNameEnum.goToStationDetails, stationId);
        } else {
            var stationEntryLogId = this.model.get('stationEntryLogId');
            this.dispatcher.trigger(EventNameEnum.goToAdHocStationDetails, stationEntryLogId);
        }
        return this;
    }

});

module.exports = StationEntryLogTileView;