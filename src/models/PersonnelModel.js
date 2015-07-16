define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var utils = require('utils');

    var PersonnelModel = Backbone.Model.extend({
        idAttribute: 'outsideId',
        set: function(attributes, options) {
            if (typeof attributes === 'object') {
                if (attributes.contactNumber) {
                    attributes.fixedPhone = utils.cleanPhone(attributes.contactNumber);
                    attributes.formattedPhone = utils.formatPhone(attributes.contactNumber);
                }
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    });

    return PersonnelModel;

});