define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var utils = require('utils');
    var template = require('hbs!templates/PersonnelTileView');

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
            var openCheckInIconState = !(this.model.get('hasOpenCheckIns') === true);
            this.$('.open-check-in-icon').toggleClass('hidden', openCheckInIconState);

            return this;
        },

        updateUserNameLabel: function () {
            if (this.model.has('userName')) {
                var userName = this.model.get('userName');
                this.$('.user-name-label').text(userName);
            }
            return this;
        },

        tileClick: function (event) {
            if (event) {
                var $target = $(event.target);

                if ($target.is('[data-button="tile"], [data-button="tile"] *') && !$target.is('[data-ignore="tile"], [data-ignore="tile"] *')) {
                    this.goToPersonnelDetailWithId(event);
                }
            }
        },

        goToPersonnelDetailWithId: function (event) {
            if (event) {
                event.preventDefault();
            }
            var personnelId = this.model.get('personnelId');
            this.dispatcher.trigger(EventNameEnum.goToPersonnelDetailWithId, personnelId);
            return this;
        }
    });

    return PersonnelTileView;
});