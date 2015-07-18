define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var config = require('config');

    var LookupDataItemRepository = function (options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(LookupDataItemRepository.prototype, {
        initialize: function (options) {
            options || (options = {});
        },
        getOptions: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: config.apiUrl() + '/lookupDataItem/find/options'
            });
        }
    });

    return LookupDataItemRepository;
});