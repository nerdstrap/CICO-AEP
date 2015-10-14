'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var SettingsRepository = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(SettingsRepository.prototype, {
    initialize: function (options) {
        options || (options = {});
    },
    getSettings: function (options) {
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var results = {
            settings: _settings
        };

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    }
});

module.exports = SettingsRepository;