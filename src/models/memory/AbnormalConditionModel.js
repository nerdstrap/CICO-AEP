define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            ModelStatesEnum = require('enums/ModelStatesEnum'),
            abnormalConditions = require('models/memory/services/abnormalConditions'),
            env = require('env');

    var AbnormalConditionModel = Backbone.Model.extend({
        getDefaultsForRendering: function() {
            return {
                caseId: '',
                eventId: '',
                startTime: '',
                title: '',
                details: '',
                troubleInfo: ''
            };
        },
        idAttribute: 'caseId',
        urlRoot: function() {
            return env.getApiUrl() + '/abnormalCondition';
        },
        initialize: function() {
            this.state = ModelStatesEnum.initial;
            this.isLoaded = false;
            this.listenTo(this, 'request', this.onRequest);
            this.listenTo(this, 'sync', this.onSync);
            this.listenTo(this, 'error', this.onError);
        },
        sync: function(method, model, options) {
            if (method === "read") {
                var xhr = options.xhr = abnormalConditions.findById(this.id).done(function(data) {
                    setTimeout(function() {
                        options.success(data, 'success', null);
                    }, 2000);
                });
                model.trigger('request', model, xhr, options);
                return xhr;
            }
        },
        onRequest: function(model, xhr, options) {
            this.state = ModelStatesEnum.loading;
        },
        onSync: function(model, xhr, options) {
            this.state = ModelStatesEnum.loaded;
            this.isLoaded = true;
        },
        onError: function(model, xhr, options) {
            this.state = ModelStatesEnum.error;
        },
        set: function(attributes, options) {
            if (typeof attributes === 'object') {
                if (!this.derivedAttributes) {
                    this.derivedAttributes = {
                        'startTimeString': null
                    };
                }
                var startTime, startTimeString = "";
                if (attributes.startTime) {
                    try {
                        startTime = new Date(attributes.startTime);
                        startTimeString = startTime.cicoDate();
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