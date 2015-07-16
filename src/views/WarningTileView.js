define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/WarningTileView');

    var StationWarningTileView = BaseView.extend({
        tagName: 'li',
        className: 'row',
        initialize: function(options) {
            console.trace('StationWarningTileView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;
        },
        render: function() {
            console.trace('StationWarningTileView.render()');
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

    return StationWarningTileView;

});