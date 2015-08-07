define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var PersonnelModel = Backbone.Model.extend({

        idAttribute: 'outsideId',

        set: function (key, val, options) {
            var attributes;
            if (typeof key === 'object') {
                attributes = key;
                options = val;
            } else {
                (attributes = {})[key] = val;
            }
            if (attributes) {
                if (attributes.hasOwnProperty('personnelType')) {
                    var personnelType = attributes.personnelType;
                    if (personnelType && !isNaN(personnelType)) {
                        attributes.personnelType = Number(personnelType);
                    }
                }
            }

            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    });

    return PersonnelModel;

});