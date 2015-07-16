define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbnormalConditionModel = Backbone.Model.extend({
        idAttribute: 'caseId',
        set: function(attributes, options) {
            if (typeof attributes === 'object') {
                if (!this.derivedAttributes) {
                    this.derivedAttributes = {
                        'startTimeString': null
                    };
                }
                var startTime, startTimeString = '';
                if (attributes.startTime) {
                    try {
                        startTime = new Date(attributes.startTime);
                        startTimeString = startTime.longDate();
                    }
                    catch (ex) {
                    }
                }
                this.derivedAttributes.startTimeString = startTimeString;

                var outage = false;
                if (attributes.eventId) {
                    if (attributes.eventId !== '' && attributes.eventId !== -1) {
                        outage = true;
                    }
                }
                this.derivedAttributes.outage = outage;
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    });

    return AbnormalConditionModel;

});