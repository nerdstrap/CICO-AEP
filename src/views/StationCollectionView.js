define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var StationTileView = require('views/StationTileView');
    var template = require('hbs!templates/StationCollectionView');

    var StationCollectionView = BaseView.extend({
        /**
         *
         * @param options
         */
        initialize: function(options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'sync', this.onSync);
            this.listenTo(this.collection, 'reset', this.onReset);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        /**
         *
         * @returns {StationCollectionView}
         */
        render: function() {
            var currentContext = this;
            currentContext.setElement(template());
            return this;
        },
        
        /**
         *
         * @param stationModel
         * @returns {StationCollectionView}
         */
        appendTile: function(stationModel) {
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
        onSync: function() {
            var currentContext = this;
            currentContext.$('.collection-loading').removeClass('hidden');
            currentContext._leaveChildren();
        },
        
        /**
         *
         */
        onReset: function() {
            var currentContext = this;
            currentContext._leaveChildren();
            _.each(currentContext.collection.models, currentContext.appendTile, currentContext);
            currentContext.$('.collection-loading').addClass('hidden');
        },
        
        /**
         *
         */
        onLoaded: function() {
            console.trace('StationCollectionView.onLoaded');
        },
        
        /**
         *
         */
        onLeave: function() {
            console.trace('StationCollectionView.onLeave');
        }
    });

    return StationCollectionView;

});