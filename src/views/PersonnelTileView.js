'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');
var template = require('templates/PersonnelTileView.hbs');

var PersonnelTileView = BaseView.extend({

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
        'click [data-button="tile"]': 'tileClick'
    },

    updateViewFromModel: function () {
        this.updateIcons();
        this.updateUserNameLabel();
        return this;
    },

    updateIcons: function () {
        var hasOpenCheckIns = this.model.get('hasOpenCheckIns');
        this.$('.open-check-in-icon').toggleClass('hidden', (hasOpenCheckIns === true));

        return this;
    },

    updateUserNameLabel: function () {
        var userName = this.model.get('userName');
        if (userName) {
            this.$('.user-name-label').text(userName);
        }
        return this;
    },

    tileClick: function (event) {
        if (event) {
            var $target = $(event.target);

            if ($target.is('[data-button="tile"], [data-button="tile"] *') && !$target.is('[data-ignore="tile"], [data-ignore="tile"] *')) {
                this.goToPersonnelDetails(event);
            }
        }
    },

    goToPersonnelDetails: function (event) {
        if (event) {
            event.preventDefault();
        }
        var personnelId = this.model.get('personnelId');
        this.dispatcher.trigger(EventNameEnum.goToPersonnelDetails, personnelId);
        return this;
    }

});

module.exports = PersonnelTileView;