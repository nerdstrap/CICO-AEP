'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var config = require('lib/config');

var PersonnelRepository = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(PersonnelRepository.prototype, {
    initialize: function (options) {
        options || (options = {});
    },
    getMyPersonnel: function () {
        var data = $.param(options);

        return $.ajax({
            contentType: 'application/json',
            data: data,
            dataType: 'json',
            type: 'GET',
            url: config.apiUrl() + '/personnel/find/me'
        });
    },
    getPersonnels: function (options) {
        options || (options = {});
        var data = $.param(options);

        return $.ajax({
            contentType: 'application/json',
            data: data,
            dataType: 'json',
            type: 'GET',
            url: config.apiUrl() + '/personnel/find'
        });
    }
});

module.exports = PersonnelRepository;