'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var config = require('lib/config');

var LookupDataItemRepository = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(LookupDataItemRepository.prototype, {
    initialize: function (options) {
        options || (options = {});
    },
    getOptions: function (options) {
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

module.exports = LookupDataItemRepository;