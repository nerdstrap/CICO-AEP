'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var EventDispatcher = function (options) {
    if (this.initialize) {
        this.initialize.apply(this, arguments);
    }
};

_.extend(EventDispatcher.prototype, Backbone.Events, {});

module.exports = EventDispatcher;