define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            ModelStatesEnum = require('enums/ModelStatesEnum'),
            AbnormalConditionModel = require('models/AbnormalConditionModel'),
            abnormalConditions = require('models/memory/services/abnormalConditions'),
            env = require('env');

    var AbnormalConditionCollection = Backbone.Collection.extend({
        model: AbnormalConditionModel,
        url: function() {
            return env.getApiUrl() + '/abnormalcondition/find/open';
        },
        initialize: function(models, options) {
            this.listenTo(this, 'request', this.onRequest);
            this.listenTo(this, 'sync', this.onSync);
            this.listenTo(this, 'error', this.onError);
        },
        sync: function(method, model, options) {
            if (method === 'read') {
                if (options.data.stationid === 404) {
                    setTimeout(function() {
                        options.error({}, 'error', null);
                    }, 2000);
                }
                else {
                    var xhr = options.xhr = abnormalConditions.findByStationId(options.data.stationid).done(function(data) {
                        setTimeout(function() {
                            options.success(data, 'success', null);
                        }, 2000);
                    });
                }
                model.trigger('request', model, xhr, options);
                return xhr;
            }
        },
        onRequest: function(model, xhr, options) {
            _.each(model.models, function(x) {
                x.state = ModelStatesEnum.loading;
                x.isLoaded = false;
            });
        },
        onSync: function(model, xhr, options) {
            _.each(model.models, function(x) {
                x.state = ModelStatesEnum.loaded;
                x.isLoaded = true;
            });
        },
        onError: function(model, xhr, options) {
            _.each(model.models, function(x) {
                x.state = ModelStatesEnum.error;
            });
        },
        getAbnormalConditionsByStationId: function(stationId, successCallback, errorCallback) {
            var currentContext = this,
                    wrappedSuccessCallback = this.wrapSearchSuccessCallback(successCallback),
                    wrappedErrorCallback = this.wrapSearchErrorCallback(errorCallback);

            var xhr = this.fetch({
                url: '/CheckInCheckOutMobile-services/webresources/abnormalcondition/find/open',
                reset: true,
                data: {
                    stationid: stationId
                },
                success: wrappedSuccessCallback,
                error: wrappedErrorCallback
            });

            return xhr;
        },
        wrapSearchSuccessCallback: function(successCallback) {
            var currentContext = this;
            return function(resultModels) {
                currentContext.state = ModelStatesEnum.loaded;
                if (successCallback) {
                    successCallback(currentContext);
                }
            };
        },
        wrapSearchErrorCallback: function(errorCallback) {
            var currentContext = this;
            return function(errorMessage) {
                currentContext.state = ModelStatesEnum.error;
                if (errorCallback) {
                    errorCallback(errorMessage);
                }
            };
        }

    });

    return AbnormalConditionCollection;

});