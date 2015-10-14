'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var EventNameEnum = require('enums/EventNameEnum');

var CoreController = function (options) {
    this.initialize.apply(this, arguments);
};

_.extend(CoreController.prototype, Backbone.Events, {

    initialize: function (options) {
        console.trace('CoreController.initialize');
        options || (options = {});
        this.router = options.router;
        this.dispatcher = options.dispatcher;
        this.geoLocationService = options.geoLocationService;
        this.persistenceContext = options.persistenceContext;
    }

});

module.exports = CoreController;