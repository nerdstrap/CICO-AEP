'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');
var template = require('templates/AdHocStationDetailView.hbs');

var AdHocStationDetailView = BaseView.extend({

    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
        options || (options = {});
        this.controller = options.controller;
        this.dispatcher = options.dispatcher || this;

        this.myPersonnelModel = options.myPersonnelModel;
        this.myOpenStationEntryLogModel = options.myOpenStationEntryLogModel;

        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'error', this.onError);
    },

    render: function () {
        this.setElement(template(this.renderModel(this.model)));
        return this;
    },

    events: {
        'click #go-to-edit-check-in-button': 'goToEditCheckIn',
        'click #go-to-check-out-button': 'goToCheckOut'
    },

    updateViewFromModel: function () {
        this.updateAdHocDescriptionHeader();
        return this;
    },

    updateAdHocDescriptionHeader: function () {
        var adHocDescription = this.model.get('adHocDescription');
        if (adHocDescription) {
            this.$('#ad-hoc-description-header').text(adHocDescription);
        }
        return this;
    },

    updateExpectedCheckOutLabel: function () {
        var currentContext = this;

        if (this.myOpenStationEntryLogModel) {
            var expectedOutTime = this.myOpenStationEntryLogModel.get('expectedOutTime');
            var formattedExpectedOutTime = utils.formatDate(expectedOutTime);
            var formattedExpectedCheckOutText = utils.formatString(utils.getResource('expectedCheckOutTextFormatString'), [formattedExpectedOutTime]);
            this.$('#expected-check-out-label').text(formattedExpectedCheckOutText);
        }
        return this;
    },

    goToEditCheckIn: function (event) {
        if (event) {
            event.preventDefault();
        }
        var stationEntryLogId = this.model.get('stationEntryLogId');
        this.dispatcher.trigger(EventNameEnum.goToEditCheckIn, stationEntryLogId);
        return this;
    },

    goToCheckOut: function (event) {
        if (event) {
            event.preventDefault();
        }
        var stationEntryLogId = this.model.get('stationEntryLogId');
        this.dispatcher.trigger(EventNameEnum.goToCheckOut, stationEntryLogId);
        return this;
    },

    onLoaded: function () {
        this.updateViewFromModel();
        this.showLoading();
    },

    onError: function (error) {
        this.showError(error);
    }
});

module.exports = AdHocStationDetailView;