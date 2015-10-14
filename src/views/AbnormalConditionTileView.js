'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');
var template = require('templates/AbnormalConditionTileView.hbs');

var AbnormalConditionTileView = BaseView.extend({

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

    updateViewFromModel: function () {
        this.updateIcons();
        this.updateTitleLabel();
        this.updateStartTimeLabel();
        this.updateDetailsLabel();
        this.updateTroubleInformationLabel();
        return this;
    },

    updateIcons: function () {
        var hasOutage = this.model.get('hasOutage');
        this.$('.has-outage-icon').toggleClass('hidden', (hasOutage === true));
        return this;
    },

    updateTitleLabel: function () {
        var title = this.model.get('title');
        if (title) {
            this.$('.title-label').text(title);
        }
        return this;
    },

    updateStartTimeLabel: function () {
        var startTime = this.model.get('startTime');
        if (startTime) {
            this.$('.start-time-label').text(utils.formatDate(startTime));
        }
        return this;
    },

    updateDetailsLabel: function () {
        var details = this.model.get('details');
        if (details) {
            this.$('.details-label').text(details);
        }
        return this;
    },

    updateTroubleInformationLabel: function () {
        var troubleInformation = this.model.get('troubleInformation');
        if (troubleInformation) {
            this.$('.trouble-information-label').text(troubleInformation);
        }
        return this;
    }
});

module.exports = AbnormalConditionTileView;