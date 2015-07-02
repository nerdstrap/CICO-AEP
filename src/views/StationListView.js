define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            StationListItemView = require('views/StationListItemView');

    var StationListView = CompositeView.extend({
        initialize: function(options) {
            console.debug('StationListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this; 
            this.listenTo(this.collection, 'reset', this.addAll);
        },
        render: function() {
            console.debug('StationListView.render');
            _.each(this.collection.models, this.addOne, this);
        },
        addAll: function() {
            console.debug('StationListView.addAll');
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
        },
        addOne: function(station) {
            var currentContext = this;
            var stationListItemView = new StationListItemView({
                model: station,
                dispatcher: currentContext.dispatcher
            });
            this.appendChild(stationListItemView);
        }

    });

    return StationListView;

});