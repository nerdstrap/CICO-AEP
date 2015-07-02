define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            template = require('hbs!templates/NearbyStationEntryListItem'),
            NearbyStationEntryPersonsView = require('views/NearbyStationEntryPersonsView');

    var NearbyStationEntryListItemView = CompositeView.extend({
        tagName: 'li',
        className: 'list-item station-list-item',
        initialize: function(options) {
            console.debug('NearbyStationEntryListItemView.initialize');
            options || (options = {});
            this.stationEntryCollection = options.stationEntryCollection;
            this.model.on('change', this.render, this);
        },
        render: function() {
            var currentContext = this;
            var renderModel = $.extend(this.model.getDefaultsForRendering(), this.model.attributes, this.model.derivedAttributes);
            this.$el.html(template(renderModel));
            
            var nearbyStationEntryPersonsView = new NearbyStationEntryPersonsView({
                collection: currentContext.stationEntryCollection,
                el: $(".station-check-ins", currentContext.el),
                dispatcher: this.dispatcher
            });
            this.renderChild(nearbyStationEntryPersonsView);
            
            this.setDirectionLink();
            this.setIndicators();
            return this;
        },
        setDirectionLink: function(){
            if(this.model.get("hasCoordinates")){
                this.$('.search-item-directions').addClass('search-item-directions-link');
            }
    
        },
        setIndicators: function(){
            if(this.model.get("hazardFlag")){               
                this.$('.hazard-text-icon').removeClass('hidden');              
            }
            if (this.model.has('stationType') && this.model.get('stationType') === 'TC') {
                this.$('.telecom-text-icon').removeClass('hidden');
            }
            if(this.model.get("restrictedFlag")){          
                this.$('.restricted-text-icon').removeClass('hidden');
            }
            if(this.model.get("hasOpenCheckIns")){
                this.$('.checked-in-text-icon').removeClass('hidden');
            }
        }
    });

    return NearbyStationEntryListItemView;

});
