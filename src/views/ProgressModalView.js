define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseModalView = require('views/BaseModalView');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/ProgressModalView');

    var ProgressModalView = BaseModalView.extend({
        initialize: function (options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },

        /**
         *
         * @returns {ProgressModalView}
         */
        render: function () {
            var currentContext = this;
            currentContext.$el.html(template());
            return this;
        },

        /**
         *
         * @returns {ProgressModalView}
         */
        show: function (promise, message) {
            var currentContext = this;
            if (message) {
                currentContext.updateProgressMessage(message);
            }
            $('#progress-modal-view').foundation('reveal', 'open');
            return this;
        },

        /**
         *
         * @returns {ProgressModalView}
         */
        hide: function () {
            var currentContext = this;
            $('#progress-modal-view').foundation('reveal', 'close');
            return this;
        },

        /**
         *
         * @returns {ProgressModalView}
         */
        updateProgressMessage: function (message) {
            var currentContext = this;
            currentContext.$('#progress-message-label').html(message);
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

    return ProgressModalView;
});
