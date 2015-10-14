'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var CheckInTypeEnum = require('enums/CheckInTypeEnum');
var StationTypeEnum = require('enums/StationTypeEnum');
var utils = require('lib/utils');
var config = require('lib/config');

var StationEntryLogModel = Backbone.Model.extend({

    idAttribute: 'stationEntryLogId',

    validation: {
        stationId: {
            required: function () {
                return (this.get('checkInType') === CheckInTypeEnum.station);
            }
        },
        contactNumber: {
            required: true,
            pattern: 'digits',
            length: 10
        },
        purpose: {
            required: true
        },
        duration: {
            required: true
        },
        dispatchCenterId: {
            required: function () {
                return (this.get('checkInType') === CheckInTypeEnum.station && this.get('stationType') === StationTypeEnum.td);
            }
        },
        otherPurpose: {
            required: function () {
                return (this.get('selectPurpose') === 'Other');
            }
        },
        adHocDescription: {
            required: function () {
                return (this.get('checkInType') === CheckInTypeEnum.adHoc);
            }
        },
        areaName: {
            required: function () {
                return (this.get('checkInType') === CheckInTypeEnum.adHoc);
            }
        },
        regionName: {
            required: function () {
                return (this.get('checkInType') === CheckInTypeEnum.adHoc);
            }
        }
    }

});

module.exports = StationEntryLogModel;