define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            ModelStatesEnum = require('enums/ModelStatesEnum'),
            env = require('env');


    var AuthModel = Backbone.Model.extend({
        
        defaults: {
            auth_mode: 'BASIC',
            orig_url: '',
            override_uri_retention: false,
            user: '',
            password: ''
        },
        
        url: function() {
            return env.getSiteRoot() + 'aep_logon/aep_logon.jsp';
        },
                
        initialize: function() {
            this.state = ModelStatesEnum.initial;
            this.isLoaded = false;
            this.listenTo(this, 'request', this.onRequest);
            this.listenTo(this, 'sync', this.onSync);
            this.listenTo(this, 'error', this.onError);
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
                
        sync: function(method, model, options) {
            if (method === 'create') {
                options.emulateJSON = true;
                options.data = this.attributes;
                options.headers = $.extend(options.headers || {}, {'ct-iis-form-query': ''});
            } 
            Backbone.Model.prototype.sync.call(this, method, model, options);
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

    return AuthModel;

});