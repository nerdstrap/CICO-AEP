'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');

var WarningTileView = BaseView.extend({

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
        'click .go-to-warning-button': 'goToWarningWithId'
    },

    updateViewFromModel: function () {
        this.updateDescriptionLabel();
        return this;
    },

    updateDescriptionLabel: function () {
        var description = this.model.get('description');
        if (description) {
            this.$('.description-label').text(description);
        }
        return this;
    },

    goToWarningWithId: function (event) {
        if (event) {
            event.preventDefault();
        }
        var warningId = this.model.get('warningId');
        this.dispatcher.trigger(EventNameEnum.goToWarningWithId, warningId);
        return this;
    }

});

module.exports = WarningTileView;