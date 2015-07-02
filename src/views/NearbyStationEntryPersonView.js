define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            template = require('hbs!templates/NearbyStationEntryPerson');

    var NearbyStationEntryPersonnelView = CompositeView.extend({
        tagName: 'li',
        initialize: function(options) {
            console.debug('NearbyStationEntryPersonnelView.initialize');
            options || (options = {});
            this.model.on('change', this.render, this);
        },
        render: function() {
            var renderModel = $.extend(this.model.getDefaultsForRendering(), this.model.attributes, this.model.derivedAttributes);
            this.$el.html(template(renderModel));
            return this;
        }
    });

    return NearbyStationEntryPersonnelView;

});