define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var EventDipatcher = function(options) {
        if (this.initialize) {
            this.initialize.apply(this, arguments);
        }
    };

    _.extend(EventDipatcher.prototype, Backbone.Events, {
    });

    return EventDipatcher;
});