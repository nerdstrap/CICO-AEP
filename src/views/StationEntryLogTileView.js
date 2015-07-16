define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/StationEntryTileView');

    var StationEntryTileView = BaseView.extend({
        tagName: 'li',
        className: 'row',
        initialize: function(options) {
            console.debug('StationEntryTileView.initialize');
            options || (options = {});
            this.nameLinkType = options.nameLinkType || NameLinkTypeEnum.personnel;
            
            this.listenTo(this.model, 'change', this.render);
        },
        render: function() {
            console.debug('StationEntryTileView.render');
            var renderModel = $.extend(this.model.getDefaultsForRendering(), this.model.attributes, this.model.derivedAttributes, this.getNameLinkProperties());
            renderModel.expectedCheckOutTimeString = "Est. CheckOut: " + this.model.getExpectedCheckOutTimeString();

            this.$el.html(template(renderModel));
            
            if (renderModel.hasCrew) {
                this.$('.hasCrew').removeClass('hidden');
            }
            return this;
        },
        getNameLinkProperties: function() {
            var nameLinkProperties = {
                'name': '',
                'name_url': ''
            };
            
            if (this.nameLinkType === NameLinkTypeEnum.personnel) {
                nameLinkProperties.name = this.model.get('userName');
                if (this.model.has('outsideId') && this.model.get('outsideId')) {
                    nameLinkProperties.name_url = '#personnel/outsideid/' + encodeURIComponent(this.model.get('outsideId'));
                }
                else {
                    nameLinkProperties.name_url = '#personnel/username/' + encodeURIComponent(this.model.get('userName'));
                }
            } else if (this.nameLinkType === NameLinkTypeEnum.station) {
                nameLinkProperties.name = this.model.get('stationName');
                if (this.model.has('stationId')) {
                    nameLinkProperties.name_url = '#station/' + this.model.get('stationId');
                }
                else if (!this.model.has('description')) {
                    nameLinkProperties.name_url = '#station';
                }
            }
            
            return nameLinkProperties;
        }

    });
    
    return StationEntryTileView;

});