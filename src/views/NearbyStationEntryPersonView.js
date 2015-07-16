define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/NearbyStationEntryPerson');

    var NearbyStationEntryPersonnelView = BaseView.extend({
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