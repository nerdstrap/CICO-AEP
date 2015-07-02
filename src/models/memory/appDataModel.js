define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            ModelStatesEnum = require('enums/ModelStatesEnum'),
            StationEntryModel = require('models/StationEntryModel'),
            appDatas = require('models/memory/services/appDatas'),
            env = require('env');

    var fixPhoneNumber = function(incoming) {
        if (incoming) {
            var originalCellPhone = incoming;
            var cellPhone = originalCellPhone.replace(/[^0-9]/g, '');
            if (cellPhone.length > 10) {
                cellPhone = cellPhone.substring(cellPhone.length - 10);
            }
            return cellPhone;
        }
        return undefined;
    };

    var AppDataModel = Backbone.Model.extend({
        defaults: {
            durationExpiredShown: false
        },
        url: function() {
            return env.getApiUrl() + '/app/config';
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
                var xhr = options.xhr = appDatas.getOne().done(function(data) {
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
                if (this.has('userInfo') && attributes.userInfo && attributes.userInfo.cellPhone) {
                    var originalCellPhone = attributes.userInfo.cellPhone;
                    var cellPhone = originalCellPhone.replace(/[^0-9]/g, '');
                    if (cellPhone.length > 10) {
                        cellPhone = cellPhone.substring(cellPhone.length - 10);
                    }
                    attributes.userInfo.cellPhone = cellPhone; 
                }
                this.state = ModelStatesEnum.loaded;
                this.isLoaded = true;
                if (attributes && attributes.userInfo && attributes.userInfo.cellPhone) {
                    attributes.userInfo.cellPhone = fixPhoneNumber(attributes.userInfo.cellPhone);
                }
                if (attributes && attributes.socPhoneNumber) {
                    attributes.socPhoneNumberFormated = env.getFormattedPhoneNumber(attributes.socPhoneNumber);
                }
                if (attributes && attributes.openStationEntry) {
                    var stationEntryModel = new StationEntryModel(attributes.openStationEntry);
                    attributes.openStationEntry = stationEntryModel;
                }
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
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

    return new AppDataModel();

});