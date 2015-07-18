define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var config = require('config');

    var WarningRepository = function (options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(WarningRepository.prototype, {
        initialize: function (options) {
            options || (options = {});
        },
        getWarnings: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: config.apiUrl() + '/station/warning/find'
            });
        },
        postAddWarning: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'PUT',
                url: config.apiUrl() + '/station/warning/add'
            });
        },
        postClearWarning: function(options) {
            options || (options = {});
            var data = JSON.stringify(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'PUT',
                url: config.apiUrl() + '/station/warning/clear'
            });
        }
    });

    return WarningRepository;
});