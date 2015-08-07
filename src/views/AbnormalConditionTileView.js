define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var utils = require('utils');
    var template = require('hbs!templates/AbnormalConditionTileView');

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
            var hasOutageIconState = !(this.model.get('hasOutage') === true);
            this.$('.has-outage-icon').toggleClass('hidden', hasOutageIconState);
            return this;
        },

        updateTitleLabel: function () {
            if (this.model.has('title')) {
                var title = this.model.get('title');
                this.$('.title-label').text(title);
            }
            return this;
        },

        updateStartTimeLabel: function () {
            if (this.model.has('startTime')) {
                var startTime = this.model.get('startTime');
                this.$('.start-time-label').text(utils.formatDate(startTime));
            }
            return this;
        },

        updateDetailsLabel: function () {
            if (this.model.has('details')) {
                var details = this.model.get('details');
                this.$('.details-label').text(details);
            }
            return this;
        },

        updateTroubleInformationLabel: function () {
            if (this.model.has('troubleInformation')) {
                var troubleInformation = this.model.get('troubleInformation');
                this.$('.trouble-information-label').text(troubleInformation);
            }
            return this;
        }
    });

    return AbnormalConditionTileView;
});