define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ModelMapper = function(options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(ModelMapper.prototype, {
        initialize: function(options) {
            options || (options = {});
        },
        mapGetMyPersonnelResponse: function(getMyPersonnelResponse, myPersonnelModel) {
            if (getMyPersonnelResponse) {
                var getMyPersonnelData;
                if (getMyPersonnelResponse.length > 0) {
                    getMyPersonnelData = getMyPersonnelResponse[0];
                } else {
                    getMyPersonnelData = getMyPersonnelResponse;
                }
                if (getMyPersonnelData && getMyPersonnelData.personnels && getMyPersonnelData.personnels.length > 0) {
                    myPersonnelModel.set(getMyPersonnelData.personnels[0]);
                }
            }
            return this;
        },
        mapGetOpenStationEntryLogsResponse: function(getOpenStationEntryLogsResponse, myOpenStationEntryLogModel) {
            if (getOpenStationEntryLogsResponse) {
                var getOpenStationEntryLogsData;
                if (getOpenStationEntryLogsResponse.length > 0) {
                    getOpenStationEntryLogsData = getOpenStationEntryLogsResponse[0];
                } else {
                    getOpenStationEntryLogsData = getOpenStationEntryLogsResponse;
                }
                if (getOpenStationEntryLogsData && getOpenStationEntryLogsData.stationEntryLogs && getOpenStationEntryLogsData.stationEntryLogs.length > 0) {
                    myOpenStationEntryLogModel.set(getOpenStationEntryLogsData.stationEntryLogs[0]);
                }
            }
            return this;
        },
        mapGetStationByIdResponse: function(getStationByIdResponse, stationModel) {
            if (getStationByIdResponse) {
                var getStationByIdData;
                if (getStationByIdResponse.length > 0) {
                    getStationByIdData = getStationByIdResponse[0];
                } else {
                    getStationByIdData = getStationByIdResponse;
                }
                if (getStationByIdData && getStationByIdData.stations && getStationByIdData.stations.length > 0) {
                    stationModel.set(getStationByIdData.stations[0]);
                }
            }
            return this;
        },
        mapGetPersonnelByIdResponse: function(getPersonnelByIdResponse, personnelModel) {
            if (getPersonnelByIdResponse) {
                var getPersonnelByIdData;
                if (getPersonnelByIdResponse.length > 0) {
                    getPersonnelByIdData = getPersonnelByIdResponse[0];
                } else {
                    getPersonnelByIdData = getPersonnelByIdResponse;
                }
                if (getPersonnelByIdData && getPersonnelByIdData.personnels && getPersonnelByIdData.personnels.length > 0) {
                    personnelModel.set(getPersonnelByIdData.personnels[0]);
                }
            }
            return this;
        },
        mapGetStationEntryLogByIdResponse: function(getStationEntryLogByIdResponse, stationEntryLogModel) {
            if (getStationEntryLogByIdResponse) {
                var getStationEntryLogByIdData;
                if (getStationEntryLogByIdResponse.length > 0) {
                    getStationEntryLogByIdData = getStationEntryLogByIdResponse[0];
                } else {
                    getStationEntryLogByIdData = getStationEntryLogByIdResponse;
                }
                if (getStationEntryLogByIdData && getStationEntryLogByIdData.stationEntryLogs && getStationEntryLogByIdData.stationEntryLogs.length > 0) {
                    stationEntryLogModel.set(getStationEntryLogByIdData.stationEntryLogs[0]);
                }
            }
            return this;
        }

    });

    return ModelMapper;
});