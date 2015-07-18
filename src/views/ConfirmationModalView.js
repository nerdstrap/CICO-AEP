define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseModalView = require('views/BaseModalView');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/ConfirmationModalView');

    var ConfirmationModalView = BaseModalView.extend({
        initialize: function (options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },

        /**
         *
         * @returns {ConfirmationModalView}
         */
        render: function () {
            var currentContext = this;
            currentContext.$el.html(template());
            return this;
        },

        /**
         *
         * @returns {ConfirmationModalView}
         */
        show: function (confirmationType, header, message) {
            var currentContext = this;
            currentContext.updateConfirmationHeader(header);
            currentContext.updateConfirmationMessage(message);
            $('#confirmation-modal-view').foundation('reveal', 'open');
            return this;
        },

        /**
         *
         * @returns {ConfirmationModalView}
         */
        hide: function () {
            var currentContext = this;
            $('#confirmation-modal-view').foundation('reveal', 'close');
            return this;
        },

        /**
         *
         * @returns {ConfirmationModalView}
         */
        updateConfirmationHeader: function (header) {
            var currentContext = this;
            currentContext.$('#confirmation-header-label').html(header);
            return this;
        },

        /**
         *
         * @returns {ConfirmationModalView}
         */
        updateConfirmationMessage: function (message) {
            var currentContext = this;
            currentContext.$('#confirmation-message-label').html(message);
            return this;
        },

        /**
         *
         */
        onLoaded: function () {
            console.trace('StationCollectionView.onLoaded');
        },

        /**
         *
         */
        onLeave: function () {
            console.trace('StationCollectionView.onLeave');
        }
    });

    return ConfirmationModalView;
});
