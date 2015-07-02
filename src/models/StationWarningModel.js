define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            env = require('env'),
            Backbone = require('backbone');

    var StationWarningModel = Backbone.Model.extend({
        idAttribute: 'stationWarningId',
        validation: {
//            userId: {
//                required: true,
//                pattern: /^[a-zA-Z0-9]*/,
//                minLength: 7,
//                maxLength: 10
//            }
        },
        set: function(attributes, options) {
            if (typeof attributes === 'object') {
                if (attributes && attributes.firstReportedDate) {
                    var firstReportedDate;
                    var firstReportedDateString;

                    try {
                        firstReportedDate = new Date(attributes.firstReportedDate);
                        firstReportedDateString = firstReportedDate.cicoDate();
                    }
                    catch (ex) {
                    }
                    attributes.firstReportedDateString = firstReportedDateString;
                }
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    });

    return StationWarningModel;
});