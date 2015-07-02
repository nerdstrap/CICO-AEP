define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            ModelStatesEnum = require('enums/ModelStatesEnum'),
            StationModel = require('models/StationModel'),
            stations = require('models/memory/services/stations'),
            env = require('env');

    var StationCollection = Backbone.Collection.extend({
        model: StationModel,
        url: function() {
            return env.getApiUrl() + '/station';
        },
        initialize: function(models, options) {
            this.state = ModelStatesEnum.initial;
            this.listenTo(this, 'request', this.onRequest);
            this.listenTo(this, 'sync', this.onSync);
            this.listenTo(this, 'error', this.onError);
        },
        sync: function(method, model, options) {
            var currentContext = this;
            if (method === 'read') {
                if (options.data.stationname) {
                    var xhr = options.xhr = stations.findByName(options.data.stationname).done(function(data) {
                        setTimeout(function() {
                            options.success(data, 'success', null);
                        }, 2000);
                    });
                    model.trigger('request', model, xhr, options);
                    return xhr;
                } else {
                    var xhr = options.xhr = stations.local(20).done(function(data) {
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
            this.state = ModelStatesEnum.loading;
            _.each(model.models, function(x) {
                x.state = ModelStatesEnum.loading;
                x.isLoaded = false;
            });
        },
        onSync: function(model, xhr, options) {
            if (this.state === ModelStatesEnum.loading) {
                this.state = ModelStatesEnum.loaded;
                _.each(model.models, function(x) {
                    x.state = ModelStatesEnum.loaded;
                    x.isLoaded = true;
                });
            }
        },
        onError: function(model, xhr, options) {
            this.state = ModelStatesEnum.error;
            _.each(model.models, function(x) {
                x.state = ModelStatesEnum.error;
            });
        }

    });

    return StationCollection;

});