define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            template = require('hbs!templates/AbnormalConditionListItem');

    var AbnormalConditionListItemView = CompositeView.extend({
        tagName: 'li',
        className: 'row',
        initialize: function(options) {
            console.debug('AbnormalConditionListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this; 
            this.model.on('change', this.render, this);
        },
        render: function() {
            console.debug('AbnormalConditionListItemView.render');
            var renderModel = $.extend(this.model.getDefaultsForRendering(), this.model.attributes, this.model.derivedAttributes);
            this.$el.html(template(renderModel));
            if (this.model.derivedAttributes.outage) {
                this.$('.outage').removeClass('hidden');
            }
            return this;
        }
    });

    return AbnormalConditionListItemView;

});