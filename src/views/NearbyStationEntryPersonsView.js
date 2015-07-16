define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var NearbyStationEntryPersonView = require('views/NearbyStationEntryPersonView');

    var NearbyStationEntryPersonsView = BaseView.extend({
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