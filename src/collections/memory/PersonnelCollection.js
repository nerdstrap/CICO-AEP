define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            ModelStatesEnum = require('enums/ModelStatesEnum'),
            PersonnelModel = require('models/PersonnelModel'),
            personnel = require('models/memory/services/personnel'),
            env = require('env');

    var PersonnelCollection = Backbone.Collection.extend({
        model: PersonnelModel,
        url: function() {
            return env.getApiUrl() + '/personnel';
        },
        initialize: function(models, options) {
            this.listenTo(this, 'request', this.onRequest);
            this.listenTo(this, 'sync', this.onSync);
            this.listenTo(this, 'error', this.onError);
        },
        sync: function(method, model, options) {
            if (method === 'read') {
                if (options.data.username) {
                    var xhr = options.xhr = personnel.findByName(options.data.username).done(function(data) {
                        setTimeout(function() {
                            options.success(data, 'success', null);
                        }, 2000);
                    });
                    model.trigger('request', model, xhr, options);
                    return xhr;
                } else {
                    var xhr = options.xhr = personnel.local(20).done(function(data) {
                        setTimeout(function() {
                            options.success(data, 'success', null);
                        }, 2000);
                    });
                    model.trigger('request', model, xhr, options);
                    return xhr;
                }
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
        getPersonnelBySearchQueryAndFilter: function(searchQuery, searchFilter, successCallback, errorCallback) {
            var currentContext = this,
                    wrappedSuccessCallback = this.wrapSearchSuccessCallback(successCallback),
                    wrappedErrorCallback = this.wrapSearchErrorCallback(errorCallback);

            var xhr = this.fetch({
                url: '/CheckInCheckOutMobile-services/webresources/personnel/find',
                reset: true,
                data: {
                    username: searchQueryPrefix
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

    return PersonnelCollection;

});