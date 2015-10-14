'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var utils = require('lib/utils');

var PersistenceContext = function (options) {
    this.initialize.apply(this, arguments);
};

_.extend(PersistenceContext.prototype, {

    initialize: function (options) {
        console.trace('PersistenceContext.initialize');
        options || (options = {});
        this.settingsRepository = options.settingsRepository;
        this.stationRepository = options.stationRepository;
        this.personnelRepository = options.personnelRepository;
        this.stationEntryLogRepository = options.stationEntryLogRepository;
        this.warningRepository = options.warningRepository;
        this.abnormalConditionRepository = options.abnormalConditionRepository;
        this.lookupDataItemRepository = options.lookupDataItemRepository;
        this.mapper = options.mapper;
    },

    getMyPersonnel: function () {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getMyPersonnel');
        this.personnelRepository.getMyPersonnel()
            .done(function (getMyPersonnelResponse) {
                var results;
                if (getMyPersonnelResponse && getMyPersonnelResponse.personnels && getMyPersonnelResponse.personnels.length > 0) {
                    results = self.mapper.mapPersonnel(getMyPersonnelResponse.personnels[0]);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getMyOpenStationEntryLog: function () {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getMyOpenStationEntryLog');
        this.stationEntryLogRepository.getMyOpenStationEntryLogs()
            .done(function (getMyOpenStationEntryLogsResponse) {
                var results;
                if (getMyOpenStationEntryLogsResponse && getMyOpenStationEntryLogsResponse.stationEntryLogs && getMyOpenStationEntryLogsResponse.stationEntryLogs.length > 0) {
                    results = self.mapper.mapStationEntryLog(getMyOpenStationEntryLogsResponse.stationEntryLogs[0]);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getStation: function (getStationRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getStation - ' + JSON.stringify(getStationRequest));
        this.stationRepository.getStation(getStationRequest)
            .done(function (getStationResponse) {
                var results;
                if (getStationResponse && getStationResponse.stations && getStationResponse.stations.length > 0) {
                    results = self.mapper.mapStation(getStationResponse.stations[0]);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getPersonnel: function (getPersonnelRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getPersonnel - ' + JSON.stringify(getPersonnelRequest));
        this.personnelRepository.getPersonnel(getPersonnelRequest)
            .done(function (getPersonnelResponse) {
                var results;
                if (getPersonnelResponse && getPersonnelResponse.personnels && getPersonnelResponse.personnels.length > 0) {
                    results = self.mapper.mapPersonnel(getPersonnelResponse.personnels[0]);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getStationEntryLog: function (getStationEntryLogRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getStationEntryLog - ' + JSON.stringify(getStationEntryLogRequest));
        this.stationEntryLogRepository.getStationEntryLog(getStationEntryLogRequest)
            .done(function (getStationEntryLogResponse) {
                var results;
                if (getStationEntryLogResponse && getStationEntryLogResponse.stationEntryLogs && getStationEntryLogResponse.stationEntryLogs.length > 0) {
                    results = self.mapper.mapStationEntryLog(getStationEntryLogResponse.stationEntryLogs[0]);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getNearbyStations: function (getNearbyStationsRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getNearbyStations - ' + JSON.stringify(getNearbyStationsRequest));
        this.stationRepository.getNearbyStations(getNearbyStationsRequest)
            .done(function (getNearbyStationsResponse) {
                var results;
                if (getNearbyStationsResponse) {
                    results = self.mapper.mapStations(getNearbyStationsResponse.stations);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getRecentStations: function (getRecentStationsRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getRecentStations - ' + JSON.stringify(getRecentStationsRequest));
        this.stationRepository.getRecentStations(getRecentStationsRequest)
            .done(function (getRecentStationsResponse) {
                var results;
                if (getRecentStationsResponse) {
                    results = self.mapper.mapStations(getRecentStationsResponse.stations);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getStations: function (getStationsRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getStations - ' + JSON.stringify(getStationsRequest));
        this.stationRepository.getStations(getStationsRequest)
            .done(function (getStationsResponse) {
                var results;
                if (getStationsResponse) {
                    results = self.mapper.mapStations(getStationsResponse.stations);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getPersonnels: function (getPersonnelsRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getPersonnels - ' + JSON.stringify(getPersonnelsRequest));
        this.personnelRepository.getPersonnels(getPersonnelsRequest)
            .done(function (getPersonnelsResponse) {
                var results;
                if (getPersonnelsResponse) {
                    results = self.mapper.mapPersonnels(getPersonnelsResponse.personnels);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getNearbyStationEntryLogs: function (getNearbyStationEntryLogsRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getNearbyStationEntryLogs - ' + JSON.stringify(getNearbyStationEntryLogsRequest));
        this.stationEntryLogRepository.getNearbyStationEntryLogs(getNearbyStationEntryLogsRequest)
            .done(function (getNearbyStationEntryLogsResponse) {
                var results;
                if (getNearbyStationEntryLogsResponse) {
                    results = self.mapper.mapStationEntryLogs(getNearbyStationEntryLogsResponse.stationEntryLogs);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getOpenStationEntryLogs: function (getOpenStationEntryLogsRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getOpenStationEntryLogs - ' + JSON.stringify(getOpenStationEntryLogsRequest));
        this.stationEntryLogRepository.getOpenStationEntryLogs(getOpenStationEntryLogsRequest)
            .done(function (getOpenStationEntryLogsResponse) {
                var results;
                if (getOpenStationEntryLogsResponse) {
                    results = self.mapper.mapStationEntryLogs(getOpenStationEntryLogsResponse.stationEntryLogs);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getRecentStationEntryLogs: function (getRecentStationEntryLogsRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getRecentStationEntryLogs - ' + JSON.stringify(getRecentStationEntryLogsRequest));
        this.stationEntryLogRepository.getRecentStationEntryLogs(getRecentStationEntryLogsRequest)
            .done(function (getRecentStationEntryLogsResponse) {
                var results;
                if (getRecentStationEntryLogsResponse) {
                    results = self.mapper.mapStationEntryLogs(getRecentStationEntryLogsResponse.stationEntryLogs);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getAbnormalConditions: function (getAbnormalConditionsRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getAbnormalConditions - ' + JSON.stringify(getAbnormalConditionsRequest));
        this.abnormalConditionRepository.getAbnormalConditions(getAbnormalConditionsRequest)
            .done(function (getAbnormalConditionsResponse) {
                var results;
                if (getAbnormalConditionsResponse) {
                    results = self.mapper.mapAbnormalConditions(getAbnormalConditionsResponse.abnormalConditions);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getWarnings: function (getWarningsRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getWarnings - ' + JSON.stringify(getWarningsRequest));
        this.warningRepository.getWarnings(getWarningsRequest)
            .done(function (getWarningsResponse) {
                var results;
                if (getWarningsResponse) {
                    results = self.mapper.mapWarnings(getWarningsResponse.warnings);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getOptions: function () {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getOptions');
        this.lookupDataItemRepository.getOptions()
            .done(function (getOptionsResponse) {
                var results = {};
                if (getOptionsResponse) {
                    results.purposes = self.mapper.mapOptions(getOptionsResponse.purposes);
                    results.durations = self.mapper.mapOptions(getOptionsResponse.durations);
                    results.areas = self.mapper.mapOptions(getOptionsResponse.areas);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    getSettings: function () {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.getSettings');
        this.settingsRepository.getSettings()
            .done(function (getSettingsResponse) {
                var results = {};
                if (getSettingsResponse) {
                    results = self.mapper.mapSettings(getSettingsResponse.settings);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    checkIn: function (checkInRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.checkIn - ' + JSON.stringify(checkInRequest));
        this.stationEntryLogRepository.checkIn(checkInRequest)
            .done(function (checkInResponse) {
                var results;
                if (checkInResponse) {
                    results = self.mapper.mapStationEntryLog(checkInResponse.stationEntryLog);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    editCheckIn: function (editCheckInRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.editCheckIn - ' + JSON.stringify(editCheckInRequest));
        this.stationEntryLogRepository.editCheckIn(editCheckInRequest)
            .done(function (editCheckInResponse) {
                var results;
                if (editCheckInResponse) {
                    results = self.mapper.mapStationEntryLog(editCheckInResponse.stationEntryLog);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    checkOut: function (checkOutRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.checkOut - ' + JSON.stringify(checkOutRequest));
        this.stationEntryLogRepository.checkOut(checkOutRequest)
            .done(function (checkOutResponse) {
                var results;
                if (checkOutResponse) {
                    results = self.mapper.mapStationEntryLog(checkOutResponse.stationEntryLog);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    addWarning: function (addWarningRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.addWarning - ' + JSON.stringify(addWarningRequest));
        this.warningRepository.addWarning(addWarningRequest)
            .done(function (addWarningResponse) {
                var results;
                if (addWarningResponse) {
                    results = self.mapper.mapWarning(addWarningResponse.warning);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    },

    clearWarning: function (clearWarningRequest) {
        var self = this;
        var deferred = $.Deferred();
        console.trace('PersistenceContext.clearWarning - ' + JSON.stringify(clearWarningRequest));
        this.warningRepository.clearWarning(clearWarningRequest)
            .done(function (clearWarningResponse) {
                var results;
                if (clearWarningResponse) {
                    results = self.mapper.mapWarning(clearWarningResponse.warning);
                }
                deferred.resolve(results);
            })
            .fail(function (error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });

        return deferred.promise();
    }

});

module.exports = PersistenceContext;