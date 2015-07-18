define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var StationTileView = require('views/StationTileView');
    var utils = require('utils');
    var template = require('hbs!templates/StationCollectionView');

    var StationCollectionView = BaseView.extend({
        /**
         *
         * @param options
         */
        initialize: function (options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'sync', this.onSync);
            this.listenTo(this.collection, 'reset', this.onReset);
            this.listenTo(this.collection, 'error', this.onReset);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        /**
         *
         * @returns {StationCollectionView}
         */
        render: function () {
            var currentContext = this;
            currentContext.setElement(template());
            return this;
        },

        /**
         *
         * @param stationModel
         * @returns {StationCollectionView}
         */
        appendTile: function (stationModel) {
            var currentContext = this;
            var stationTileView = new StationTileView({
                'dispatcher': currentContext.dispatcher,
                'model': stationModel
            });
            currentContext.appendChildTo(stationTileView, '.tile-wrap');
            return this;
        },
        /**
         *
         */
        onSync: function () {
            var currentContext = this;
            currentContext.hideMessage();
            currentContext.$('.station-collection-loading-image-container').removeClass('hidden');
        },

        /**
         *
         */
        onReset: function () {
            var currentContext = this;
            currentContext.hideMessage();
            if (currentContext.collection.models && currentContext.collection.models.length < 1) {
                currentContext.showMessage(utils.getResource('noResultsMessageText'));
            }
            currentContext._leaveChildren();
            _.each(currentContext.collection.models, currentContext.appendTile, currentContext);
            currentContext.$('.station-collection-loading-image-container').addClass('hidden');
        },

        /**
         *
         */
        onError: function (error) {
            var currentContext = this;
            currentContext.$('.station-collection-loading-image-container').addClass('hidden');
            currentContext.showMessage(error);
        },

        /**
         *
         * @param messageText
         */
        showMessage: function (messageText) {
            var currentContext = this;
            currentContext.$('.station-collection-message-container').removeClass('hidden');
            currentContext.$('.station-collection-message-label').text(messageText);
        },

        /**
         *
         */
        hideMessage: function () {
            var currentContext = this;
            currentContext.$('.station-collection-message-label').text('');
            currentContext.$('.station-collection-message-container').addClass('hidden');
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

    return StationCollectionView;

});