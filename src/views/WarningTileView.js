define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var utils = require('utils');
    var template = require('hbs!templates/WarningTileView');

    var WarningTileView = BaseView.extend({
        /**
         *
         * @param options
         */
        initialize: function(options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        /**
         *
         * @returns {WarningTileView}
         */
        render: function() {
            var currentContext = this;
            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.setElement(template(renderModel));
            currentContext.updateViewFromModel();
            return this;
        },
        
        /**
         *
         */
        events: {
            'click .go-to-directions-button': 'goToDirectionsWithLatLng',
            'click .go-to-warning-button': 'goToWarningWithId'
        },
        
        /**
         *
         * @returns {WarningTileView}
         */
        updateViewFromModel: function() {
            var currentContext = this;
            currentContext.updateDescriptionLabel();
            return this;
        },
        
        /**
         *
         * @returns {WarningTileView}
         */
        updateDescriptionLabel: function() {
            var currentContext = this;
            if (currentContext.model.has('description')) {
                var description = currentContext.model.get('description');
                currentContext.$('.description-label').text(description);
            }
            return this;
        },
        
        /**
         *
         * @param event
         * @returns {WarningTileView}
         */
        goToDirectionsWithLatLng: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            currentContext.dispatcher.trigger(EventNameEnum.goToDirectionsWithLatLng, latitude, longitude);
            return this;
        },
        
        /**
         *
         * @param event
         * @returns {WarningTileView}
         */
        goToWarningWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var warningId = this.model.get('warningId');
            currentContext.dispatcher.trigger(EventNameEnum.goToWarningWithId, warningId);
            return this;
        },
        
        /**
         * 
         */
        onLoaded: function() {
            console.trace('WarningTileView.onLoaded');
        },
        
        /**
         * 
         */
        onLeave: function() {
            console.trace('WarningTileView.onLeave');
        }
    });

    return WarningTileView;
});