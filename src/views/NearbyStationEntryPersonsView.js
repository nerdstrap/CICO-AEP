define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            NearbyStationEntryPersonView = require('views/NearbyStationEntryPersonView');

    var NearbyStationEntryPersonsView = CompositeView.extend({
        initialize: function (options) {
            console.debug('NearbyStationEntryPersonsView.initialize');
            options || (options = {});
            this.listenTo(this.collection, 'reset', this.addAll);
        },
        
        render: function(){
            _.each(this.collection.models, this.addOne, this);
        },
        
        addAll: function () {
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
        },
                
        addOne: function(stationEntry){
            var nearbyStationEntryPersonView = new NearbyStationEntryPersonView({
                model: stationEntry
            });
            this.appendChild(nearbyStationEntryPersonView);
        }

    });
    
    return NearbyStationEntryPersonsView;

});