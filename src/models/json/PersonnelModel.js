define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            
            env = require('env');

    var PersonnelModel = Backbone.Model.extend({
        defaults: {
            userName: '',
            contact: '',
            fixedPhone: '',
            outsideId: ''
        },
        idAttribute: 'outsideId',
        set: function(attributes, options) {
            if (typeof attributes === 'object') {
                if (attributes.contact) {
                    attributes.fixedPhone = env.getPhoneFixedNumber(attributes.contact);
                    attributes.formattedPhone = env.getFormattedPhoneNumber(attributes.contact);
                }
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        },
        getPersonnels: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/personnel/find'
            });
        },
        getByUsername: function(successCallback, errorCallback) {
            var currentContext = this;

            var name = this.get('userName');
            var request = {
                userName: name,
                includeDol: true,
                includeNoc: true
            };

            $.when(this.getPersonnels(request)).done(function(getPersonnelsResponse) {
                if (getPersonnelsResponse && getPersonnelsResponse.personnels && getPersonnelsResponse.personnels.length > 0) {
                    currentContext.set(getPersonnelsResponse.personnels[0]);
                    if (successCallback) {
                        successCallback(currentContext);
                    }
                } else {
                    if (errorCallback) {
                        errorCallback();
                    }
                }
            }).fail(function() {
                currentContext.clear();
                if (errorCallback) {
                    errorCallback();
                }
            });
        },
        getByOutsideId: function(successCallback, errorCallback) {
            var currentContext = this;
            var outsideId = this.get('outsideId');
            var request = {
                outsideId: outsideId,
                includeDol: true,
                includeNoc: true
            };

            $.when(this.getPersonnels(request)).done(function(getPersonnelsResponse) {
                if (getPersonnelsResponse && getPersonnelsResponse.personnels && getPersonnelsResponse.personnels.length > 0) {
                    currentContext.set(getPersonnelsResponse.personnels[0]);
                    if (successCallback) {
                        successCallback(currentContext);
                    }
                } else {
                    if (errorCallback) {
                        errorCallback();
                    }
                }
            }).fail(function() {
                currentContext.clear();
                if (errorCallback) {
                    errorCallback();
                }
            });
        }
    });

    return PersonnelModel;

});