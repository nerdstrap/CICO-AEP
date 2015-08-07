define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var EventDispatcher = function(options) {
        if (this.initialize) {
            this.initialize.apply(this, arguments);
        }
    };

    _.extend(EventDispatcher.prototype, Backbone.Events, {
    });

    return EventDispatcher;
});