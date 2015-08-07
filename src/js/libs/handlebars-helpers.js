define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Handlebars = require('Handlebars');
    var utils = require('utils');

    Handlebars.registerHelper('resource', utils.getResource);

    Handlebars.registerHelper('default', function(value) {
        if (value) {
            return value;
        } else {
            var defaultValue = "";
            return new Handlebars.SafeString(defaultValue);
        }
    });

    Handlebars.registerHelper('phone', function(value) {
        if (value) {
            return utils.formatPhone(value);
        } else {
            var defaultValue = "";
            return new Handlebars.SafeString(defaultValue);
        }
    });

    Handlebars.registerHelper('datetime', function(value) {
        if (value) {
            return utils.formatDate(value);
        } else {
            var defaultValue = "";
            return new Handlebars.SafeString(defaultValue);
        }
    });
    
});