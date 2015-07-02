define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            ModelStatesEnum = require('enums/ModelStatesEnum'),
            StationEntryModel = require('models/StationEntryModel'),
            stationEntries = require('models/memory/services/stationEntries'),
            env = require('env');

    var methodMap = {
        'create': 'POST',
        'update': 'PUT',
        'patch': 'PATCH',
        'delete': 'DELETE',
        'read': 'GET'
    };

    var StationEntryCollection = Backbone.Collection.extend({
        model: StationEntryModel,
        url: function() {
            return env.getApiUrl() + '/stationEntry';
        },
        initialize: function(models, options) {
            this.listenTo(this, 'request', this.onRequest);
            this.listenTo(this, 'sync', this.onSync);
            this.listenTo(this, 'error', this.onError);
        },
        sync: function(method, model, options) {
            if (method === 'read') {
                if (options.data && options.data.stationid === 404) {
                    setTimeout(function() {
                        options.error({}, 'error', null);
                    }, 2000);
                } else {
                    var xhr = options.xhr = stationEntries.getAll().done(function(data) {
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
        getOpenStationEntries: function(successCallback, errorCallback) {
            var wrappedSuccessCallback = this.wrapSearchSuccessCallback(successCallback),
                    wrappedErrorCallback = this.wrapSearchErrorCallback(errorCallback);

            this.fetch(
                    {
                        url: env.getApiUrl() + '/stationEntry/open',
                        reset: true,
                        success: wrappedSuccessCallback,
                        error: wrappedErrorCallback
                    }
            );
        },
        getRecentStationEntriesByStationId: function(stationId, successCallback, errorCallback) {
            var currentContext = this,
                    wrappedSuccessCallback = this.wrapSearchSuccessCallback(successCallback),
                    wrappedErrorCallback = this.wrapSearchErrorCallback(errorCallback);

            this.fetch({
                url: env.getApiUrl() + '/stationEntry/recent',
                reset: true,
                data: $.param({
                    stationid: stationId
                }),
                success: wrappedSuccessCallback,
                error: wrappedErrorCallback
            });
        },
        getRecentStationEntriesByPersonnel: function(personnel, successCallback, errorCallback) {
            var currentContext = this,
                    wrappedSuccessCallback = this.wrapSearchSuccessCallback(successCallback),
                    wrappedErrorCallback = this.wrapSearchErrorCallback(errorCallback);
            var data = null;
            if (personnel.has("aepId") && personnel.get("aepId").length > 0) {
                data = {
                    outsideid: personnel.get("aepId")
                };
            }
            else {
                data = {
                    username: personnel.get("userName")
                };
            }

            var xhr = this.fetch({
                url: env.getApiUrl() + '/stationEntry/recent',
                reset: true,
                data: data,
                success: wrappedSuccessCallback,
                error: wrappedErrorCallback
            });

            return xhr;
        },
        wrapSearchSuccessCallback: function(successCallback) {
            var currentContext = this;
            return function() {
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

    return StationEntryCollection;

});