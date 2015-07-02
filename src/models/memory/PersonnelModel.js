define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            ModelStatesEnum = require('enums/ModelStatesEnum'),
            personnel = require('models/memory/services/personnel'),
            env = require('env');

    var PersonnelModel = Backbone.Model.extend({
        defaults: {
            userName: '',
            contact: '',
            fixedPhone: '',
            outsideId: ''
        },
        idAttribute: 'aepId',
        urlRoot: function() {
            return env.getApiUrl() + '/personnel';
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
                var xhr = options.xhr = personnel.findById(this.id).done(function(data) {
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
                if (attributes.aepId) {
                    attributes.outsideId = attributes.aepId;
                }

                if (attributes.contact) {
                    attributes.fixedPhone = env.getPhoneFixedNumber(attributes.contact);
                    attributes.formattedPhone = env.getFormattedPhoneNumber(attributes.contact);
                }
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        },
        getByUsername: function(successCallback, errorCallback) {
            var wrappedSuccessCallback = this.wrapSuccessCallback(successCallback),
                    wrappedErrorCallback = this.wrapErrorCallback(errorCallback);

            var name = this.get('userName');

            var xhr = this.fetch({
                url: env.getApiUrl() + '/personnel/username/' + encodeURIComponent(name),
                reset: true,
                success: wrappedSuccessCallback,
                error: wrappedErrorCallback
            });

            return xhr;
        },
        getByOutsideId: function(successCallback, errorCallback) {
            var wrappedSuccessCallback = this.wrapSuccessCallback(successCallback),
                    wrappedErrorCallback = this.wrapErrorCallback(errorCallback);

            var outsideId = this.get('aepId');

            var xhr = this.fetch({
                url: env.getApiUrl() + '/personnel/aepid/' + encodeURIComponent(outsideId),
                reset: true,
                success: wrappedSuccessCallback,
                error: wrappedErrorCallback
            });

            return xhr;
        },
        wrapSuccessCallback: function(successCallback) {
            var currentContext = this;
            return function(model, resp, options) {
                currentContext.state = ModelStatesEnum.loaded;
                if (successCallback) {
                    successCallback(model, resp, options);
                }
            };
        },
        wrapErrorCallback: function(errorCallback) {
            var currentContext = this;
            return function(model, resp, options) {
                currentContext.state = ModelStatesEnum.error;
                if (errorCallback) {
                    errorCallback(model, resp, options);
                }
            };
        }
    });

    return PersonnelModel;

});