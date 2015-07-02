define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            template = require('hbs!templates/StationListItem');

    var StationListItemView = CompositeView.extend({
        tagName: 'li',
        className: 'list-item station-list-item',
        initialize: function(options) {
            console.debug('StationListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this; 
            this.model.on('change', this.render, this);
        },
        render: function() {
            console.debug('StationListItemView.render');
            this.$el.html(template(this.model.attributes));
            this.setIndicators();
            return this;
        },
        events: {
            'click .station-name-text-link': 'goToStationWithId',
            'click .directions-text-link': 'goToDirections'
        },
        setIndicators: function() {
            if (this.model.get("hasHazard")) {
                this.$('.hazard-text-icon').removeClass('hidden');
            }
            if (this.model.has('stationType') && this.model.get('stationType') === 'TC') {
                this.$('.telecom-text-icon').removeClass('hidden');
            }
            if(this.model.get("restrictedFlag")){          
                this.$('.restricted-text-icon').removeClass('hidden');
            }
            if (this.model.get("hasOpenCheckIns")) {
                this.$('.checked-in-text-icon').removeClass('hidden');
            }
            if (this.model.has("linkedStationId") && this.model.has('linkedStationName') && (this.model.get('linkedStationName').length > 0) && this.model.get('stationType') === 'TC') {
                this.$('.linked-station-text-icon').removeClass('hidden');
            }
            if (this.model.get("hasWarnings")) {
                this.$('.warning-text-icon').removeClass('hidden');
            }
        },
        goToStationWithId: function(event) {
            if (event) {
                event.preventDefault();
            }
            var station = this.model;
            this.dispatcher.trigger('goToStationWithId', station.get('stationId'));
        },
        goToDirections: function(event) {
            if (event) {
                event.preventDefault();
            }
            var station = this.model;
            this.dispatcher.trigger('goToDirections', station);
        }
    });

    return StationListItemView;

});