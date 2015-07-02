define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            globals = require('globals'),
            CompositeView = require('views/base/CompositeView'),
            NearbyStationEntryListItemView = require('views/NearbyStationEntryListItemView');

    var NearbyStationEntryListView = CompositeView.extend({
        initialize: function(options) {
            console.debug('NearbyStationEntryListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.listenTo(this.collection, 'reset', this.addAll);
        },
        addAll: function() {
            var nearbyCheckedIns = _.groupBy(this.collection.models, function(stationEntry) {
                if (stationEntry.get('stationId')) {
                    return stationEntry.get('stationId');
                } else {
                    return 'AdHoc: ' + stationEntry.get('stationEntryLogId');
                }
            });
            this._leaveChildren();
            nearbyCheckedIns = _.sortBy(nearbyCheckedIns, function(arrayElement) {
                return arrayElement[0].get('distanceInMiles');
            }); 
            _.each(nearbyCheckedIns, this.addOne, this);
        },
        addOne: function(nearbyCheckIns) {
            var currentContext = this;
            var nearbyStationEntryListItemView = new NearbyStationEntryListItemView({
                model: nearbyCheckIns[0],
                stationEntryCollection: new Backbone.Collection(nearbyCheckIns)
            });
            currentContext.appendChild(nearbyStationEntryListItemView);
        },
        events: {
            "click .nearbyCheckIn": "goToNearbyStation",
            "click .clickablePhoneNumber": "callPhoneNumber",
            "click .search-item-directions": "goToDirections"
        },
        goToNearbyStation: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (!event.target.classList.contains("phone-text-link")
                && !event.target.classList.contains(".directions-text-link")) {
                var stationId = $(event.target).closest('.nearbyCheckIn').data('stationid');
                if (stationId) {
                    this.dispatcher.trigger('goToStationWithId', stationId);
                }
            }
        },                
        callPhoneNumber: function(event) {
            if (event) {
                event.preventDefault();
            }
            var phoneNumberHref = event.target.attributes.href.value;
            if (phoneNumberHref) {
                globals.window.location.href = phoneNumberHref;
            }
        },
        goToDirections: function(event) {
            if (event) {
                event.preventDefault();
            }
            var latitude = $(event.target).closest('.nearbyCheckIn').data('latitude');
            var longitude = $(event.target).closest('.nearbyCheckIn').data('longitude');
            this.dispatcher.trigger('goToDirections', latitude, longitude);
        }
    });

    return NearbyStationEntryListView;

});