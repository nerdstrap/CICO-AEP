define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var WarningModel = Backbone.Model.extend({
        idAttribute: 'stationWarningId',
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

    return WarningModel;
});