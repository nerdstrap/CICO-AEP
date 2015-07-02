define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            StationEntryModel = require('models/StationEntryModel'),
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
        getAppConfig: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/app/config'
            });
        },
        defaults: {
            durationExpiredShown: false
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

                if (attributes && attributes.userInfo && attributes.userInfo.cellPhone) {
                    attributes.userInfo.cellPhone = fixPhoneNumber(attributes.userInfo.cellPhone);
                }
                if (attributes && attributes.socPhoneNumber) {
                    attributes.socPhoneNumberFormated = env.getFormattedPhoneNumber(attributes.socPhoneNumber);
                }
                if (attributes && attributes.contactNumber) {
                    attributes.contactNumberFormated = env.getFormattedPhoneNumber(attributes.contactNumber);
                    attributes.contactNumberFixed = env.getPhoneFixedNumber(attributes.contactNumber);
                }
                if (attributes.hasOwnProperty('openStationEntry')) {
                    var openStationEntry = new StationEntryModel(attributes.openStationEntry);
                    attributes.openStationEntry = openStationEntry;
                }
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        },
        getAppDataModel: function(successCallback, errorCallback) {
            var currentContext = this;
            $.when(currentContext.getAppConfig()).done(function(getAppConfigResponse) {
                currentContext.set(getAppConfigResponse);
                if (successCallback) {
                    successCallback(currentContext);
                }
            }).fail(function() {
                currentContext.clear();
                if (errorCallback) {
                    errorCallback();
                }
            });
        }
    });

    return new AppDataModel();

});