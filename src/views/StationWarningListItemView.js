define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            template = require('hbs!templates/StationWarningListItem');

    var StationWarningListItemView = CompositeView.extend({
        tagName: 'li',
        className: 'row',
        initialize: function(options) {
            console.trace('StationWarningListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;
        },
        render: function() {
            console.trace('StationWarningListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        updateViewFromModel: function() {
            if (this.model.has('lastConfirmedBy') && this.model.get('lastConfirmedBy')) {
                this.$('#last-confirmed-by-container').removeClass('hidden');
            } else {
                this.$('#last-confirmed-by-container').addClass('hidden');
            }
        }
    });

    return StationWarningListItemView;

});