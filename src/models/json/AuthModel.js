define(function(require) {
    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
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
        sync: function(method, model, options) {
            if (method === 'create') {
                options.emulateJSON = true;
                options.data = this.attributes;
                options.headers = $.extend(options.headers || {}, {'ct-iis-form-query': ''});
            }
            Backbone.Model.prototype.sync.call(this, method, model, options);
        }
    });

    return AuthModel;

});