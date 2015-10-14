'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var config = require('lib/config');

var StationRepository = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(StationRepository.prototype, {
    initialize: function (options) {
        options || (options = {});
    },
    getNearbyStations: function (options) {
        options || (options = {});
        var data = $.param(options);

        return $.ajax({
            contentType: 'application/json',
            data: data,
            dataType: 'json',
            type: 'GET',
            url: config.apiUrl() + '/station/find/nearby'
        });
    },
    getStations: function (options) {
        options || (options = {});
        var data = $.param(options);

        return $.ajax({
            contentType: 'application/json',
            data: data,
            dataType: 'json',
            type: 'GET',
            url: config.apiUrl() + '/station/find'
        });
    }
});

module.exports = StationRepository;