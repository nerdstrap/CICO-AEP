define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/AbnormalConditionTileView');

    var AbnormalConditionTileView = BaseView.extend({
        tagName: 'li',
        className: 'row',
        initialize: function(options) {
            console.debug('AbnormalConditionTileView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.model.on('change', this.render, this);
        },
        render: function() {
            console.debug('AbnormalConditionTileView.render');
            var renderModel = $.extend(this.model.getDefaultsForRendering(), this.model.attributes, this.model.derivedAttributes);
            this.$el.html(template(renderModel));
            if (this.model.derivedAttributes.outage) {
                this.$('.outage').removeClass('hidden');
            }
            return this;
        }
    });

    return AbnormalConditionTileView;

});