define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var utils = require('utils');

    var PersistenceContext = function (options) {
        //noinspection JSUnusedAssignment
        options || (options = {});
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

            this.defaultIncludeDol = true;
            this.defaultIncludeNoc = true;
            this.defaultDistanceThreshold = 50;
            this.defaultResultCountThreshold = 20;
        },

        getMyPersonnel: function () {
            var getMyPersonnelRequest = {};
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getMyPersonnel - ' + JSON.stringify(getMyPersonnelRequest));
            this.personnelRepository.getMyPersonnel(getMyPersonnelRequest)
                .done(function (getMyPersonnelResponse) {
                    var results;
                    if (getMyPersonnelResponse && getMyPersonnelResponse.personnels && getMyPersonnelResponse.personnels.length > 0) {
                        results = getMyPersonnelResponse.personnels[0];
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
            var getMyOpenStationEntryLogRequest = {};
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getMyOpenStationEntryLog - ' + JSON.stringify(getMyOpenStationEntryLogRequest));
            this.stationEntryLogRepository.getMyOpenStationEntryLog(getMyOpenStationEntryLogRequest)
                .done(function (getMyOpenStationEntryLogResponse) {
                    var results;
                    if (getMyOpenStationEntryLogResponse && getMyOpenStationEntryLogResponse.stationEntryLogs && getMyOpenStationEntryLogResponse.stationEntryLogs.length > 0) {
                        results = getMyOpenStationEntryLogResponse.stationEntryLogs[0];
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getStationByStationId: function (stationId) {
            var getStationByStationIdRequest = {
                stationId: stationId
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getStationByStationId - ' + JSON.stringify(getStationByStationIdRequest));
            this.stationRepository.getStationByStationId(getStationByStationIdRequest)
                .done(function (getStationByStationIdResponse) {
                    var results;
                    if (getStationByStationIdResponse && getStationByStationIdResponse.stations && getStationByStationIdResponse.stations.length > 0) {
                        results = getStationByStationIdResponse.stations[0];
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getPersonnelByPersonnelId: function (personnelId) {
            var getPersonnelByPersonnelIdRequest = {
                personnelId: personnelId
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getPersonnelByPersonnelId - ' + JSON.stringify(getPersonnelByPersonnelIdRequest));
            this.personnelRepository.getPersonnelByPersonnelId(getPersonnelByPersonnelIdRequest)
                .done(function (getPersonnelByPersonnelIdResponse) {
                    var results;
                    if (getPersonnelByPersonnelIdResponse && getPersonnelByPersonnelIdResponse.personnels && getPersonnelByPersonnelIdResponse.personnels.length > 0) {
                        results = getPersonnelByPersonnelIdResponse.personnels[0];
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getPersonnelByUserName: function (userName) {
            var getPersonnelByUserNameRequest = {
                userName: userName
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getPersonnelByUserName - ' + JSON.stringify(getPersonnelByUserNameRequest));
            this.personnelRepository.getPersonnelByUserName(getPersonnelByUserNameRequest)
                .done(function (getPersonnelByUserNameResponse) {
                    var results;
                    if (getPersonnelByUserNameResponse && getPersonnelByUserNameResponse.personnels && getPersonnelByUserNameResponse.personnels.length > 0) {
                        results = getPersonnelByUserNameResponse.personnels[0];
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getStationEntryLogByStationEntryLogId: function (stationEntryLogId) {
            var getStationEntryLogByStationEntryLogIdRequest = {
                stationEntryLogId: stationEntryLogId
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getStationEntryLogByStationEntryLogId - ' + JSON.stringify(getStationEntryLogByStationEntryLogIdRequest));
            this.stationEntryLogRepository.getStationEntryLogByStationEntryLogId(getStationEntryLogByStationEntryLogIdRequest)
                .done(function (getStationEntryLogByStationEntryLogIdResponse) {
                    var results;
                    if (getStationEntryLogByStationEntryLogIdResponse && getStationEntryLogByStationEntryLogIdResponse.stationEntryLogs && getStationEntryLogByStationEntryLogIdResponse.stationEntryLogs.length > 0) {
                        results = getStationEntryLogByStationEntryLogIdResponse.stationEntryLogs[0];
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getNearbyStations: function (latitude, longitude, includeDol, includeNoc, distanceThreshold, resultCountThreshold) {
            if (!includeDol) {
                includeDol = this.defaultIncludeDol;
            }
            if (!includeNoc) {
                includeNoc = this.defaultIncludeNoc;
            }
            if (!distanceThreshold) {
                distanceThreshold = this.defaultDistanceThreshold;
            }
            if (!resultCountThreshold) {
                resultCountThreshold = this.defaultResultCountThreshold;
            }
            var getNearbyStationsRequest = {
                latitude: latitude,
                longitude: longitude,
                includeDol: includeDol,
                includeNoc: includeNoc,
                distanceThreshold: distanceThreshold,
                resultCountThreshold: resultCountThreshold
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getNearbyStations - ' + JSON.stringify(getNearbyStationsRequest));
            this.stationRepository.getNearbyStations(getNearbyStationsRequest)
                .done(function (getNearbyStationsResponse) {
                    var results;
                    if (getNearbyStationsResponse) {
                        results = getNearbyStationsResponse.stations;
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getRecentStations: function (includeDol, includeNoc, resultCountThreshold) {
            if (!includeDol) {
                includeDol = this.defaultIncludeDol;
            }
            if (!includeNoc) {
                includeNoc = this.defaultIncludeNoc;
            }
            if (!resultCountThreshold) {
                resultCountThreshold = this.defaultResultCountThreshold;
            }
            var getRecentStationsRequest = {
                includeDol: includeDol,
                includeNoc: includeNoc,
                resultCountThreshold: resultCountThreshold
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getRecentStations - ' + JSON.stringify(getRecentStationsRequest));
            this.stationRepository.getRecentStations(getRecentStationsRequest)
                .done(function (getRecentStationsResponse) {
                    var results;
                    if (getRecentStationsResponse) {
                        results = getRecentStationsResponse.stations;
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getStationsByStationName: function (stationName, includeDol, includeNoc, resultCountThreshold) {
            if (!includeDol) {
                includeDol = this.defaultIncludeDol;
            }
            if (!includeNoc) {
                includeNoc = this.defaultIncludeNoc;
            }
            if (!resultCountThreshold) {
                resultCountThreshold = this.defaultResultCountThreshold;
            }
            var getStationsByStationNameRequest = {
                stationName: stationName,
                includeDol: includeDol,
                includeNoc: includeNoc,
                resultCountThreshold: resultCountThreshold
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getStationsByStationName - ' + JSON.stringify(getStationsByStationNameRequest));
            this.stationRepository.getStationsByStationName(getStationsByStationNameRequest)
                .done(function (getStationsByStationNameResponse) {
                    var results;
                    if (getStationsByStationNameResponse) {
                        results = getStationsByStationNameResponse.stations;
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getPersonnelsByUserName: function (userName, includeDol, includeNoc, resultCountThreshold) {
            if (!includeDol) {
                includeDol = this.defaultIncludeDol;
            }
            if (!includeNoc) {
                includeNoc = this.defaultIncludeNoc;
            }
            if (!resultCountThreshold) {
                resultCountThreshold = this.defaultResultCountThreshold;
            }
            var getPersonnelsByUserNameRequest = {
                userName: userName,
                includeDol: includeDol,
                includeNoc: includeNoc,
                resultCountThreshold: resultCountThreshold
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getPersonnelsByUserName - ' + JSON.stringify(getPersonnelsByUserNameRequest));
            this.personnelRepository.getPersonnelsByUserName(getPersonnelsByUserNameRequest)
                .done(function (getPersonnelsByUserNameResponse) {
                    var results;
                    if (getPersonnelsByUserNameResponse) {
                        results = getPersonnelsByUserNameResponse.personnels;
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getRecentStationEntryLogsByStationId: function (stationId, resultCountThreshold) {
            if (!resultCountThreshold) {
                resultCountThreshold = this.defaultResultCountThreshold;
            }
            var getRecentStationEntryLogsByStationIdRequest = {
                stationId: stationId,
                resultCountThreshold: resultCountThreshold
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getRecentStationEntryLogsByStationId - ' + JSON.stringify(getRecentStationEntryLogsByStationIdRequest));
            this.stationEntryLogRepository.getRecentStationEntryLogsByStationId(getRecentStationEntryLogsByStationIdRequest)
                .done(function (getRecentStationEntryLogsByStationIdResponse) {
                    var results;
                    if (getRecentStationEntryLogsByStationIdResponse) {
                        results = getRecentStationEntryLogsByStationIdResponse.stationEntryLogs;
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getRecentStationEntryLogsByPersonnelId: function (personnelId, resultCountThreshold) {
            if (!resultCountThreshold) {
                resultCountThreshold = this.defaultResultCountThreshold;
            }
            var getRecentStationEntryLogsByPersonnelIdRequest = {
                personnelId: personnelId,
                resultCountThreshold: resultCountThreshold
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getRecentStationEntryLogsByPersonnelId - ' + JSON.stringify(getRecentStationEntryLogsByPersonnelIdRequest));
            this.stationEntryLogRepository.getRecentStationEntryLogsByPersonnelId(getRecentStationEntryLogsByPersonnelIdRequest)
                .done(function (getRecentStationEntryLogsByPersonnelIdResponse) {
                    var results;
                    if (getRecentStationEntryLogsByPersonnelIdResponse) {
                        results = getRecentStationEntryLogsByPersonnelIdResponse.stationEntryLogs;
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getRecentStationEntryLogsByUserName: function (userName, resultCountThreshold) {
            if (!resultCountThreshold) {
                resultCountThreshold = this.defaultResultCountThreshold;
            }
            var getRecentStationEntryLogsByUserNameRequest = {
                userName: userName,
                resultCountThreshold: resultCountThreshold
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getRecentStationEntryLogsByUserName - ' + JSON.stringify(getRecentStationEntryLogsByUserNameRequest));
            this.stationEntryLogRepository.getRecentStationEntryLogsByUserName(getRecentStationEntryLogsByUserNameRequest)
                .done(function (getRecentStationEntryLogsByUserNameResponse) {
                    var results;
                    if (getRecentStationEntryLogsByUserNameResponse) {
                        results = getRecentStationEntryLogsByUserNameResponse.stationEntryLogs;
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getNearbyStationEntryLogs: function (latitude, longitude, includeDol, includeNoc, distanceThreshold, resultCountThreshold) {
            if (!includeDol) {
                includeDol = this.defaultIncludeDol;
            }
            if (!includeNoc) {
                includeNoc = this.defaultIncludeNoc;
            }
            if (!distanceThreshold) {
                distanceThreshold = this.defaultDistanceThreshold;
            }
            if (!resultCountThreshold) {
                resultCountThreshold = this.defaultResultCountThreshold;
            }
            var getNearbyStationEntryLogsRequest = {
                latitude: latitude,
                longitude: longitude,
                includeDol: includeDol,
                includeNoc: includeNoc,
                distanceThreshold: distanceThreshold,
                resultCountThreshold: resultCountThreshold
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getNearbyStationEntryLogs - ' + JSON.stringify(getNearbyStationEntryLogsRequest));
            this.stationEntryLogRepository.getNearbyStationEntryLogs(getNearbyStationEntryLogsRequest)
                .done(function (getNearbyStationEntryLogsResponse) {
                    var results;
                    if (getNearbyStationEntryLogsResponse) {
                        results = getNearbyStationEntryLogsResponse.stationEntryLogs;
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getAbnormalConditionsByStationId: function (stationId) {
            var getAbnormalConditionsByStationIdRequest = {
                stationId: stationId
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getAbnormalConditionsByStationId - ' + JSON.stringify(getAbnormalConditionsByStationIdRequest));
            this.abnormalConditionRepository.getAbnormalConditionsByStationId(getAbnormalConditionsByStationIdRequest)
                .done(function (getAbnormalConditionsByStationIdResponse) {
                    var results;
                    if (getAbnormalConditionsByStationIdResponse) {
                        results = getAbnormalConditionsByStationIdResponse.abnormalConditions;
                    }
                    deferred.resolve(results);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getWarningsByStationId: function (stationId) {
            var getWarningsByStationIdRequest = {
                stationId: stationId
            };
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getWarningsByStationId - ' + JSON.stringify(getWarningsByStationIdRequest));
            this.warningRepository.getWarningsByStationId(getWarningsByStationIdRequest)
                .done(function (getWarningsByStationIdResponse) {
                    var results;
                    if (getWarningsByStationIdResponse) {
                        results = getWarningsByStationIdResponse.warnings;
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
            var getOptionsRequest = {};
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getOptions - ' + JSON.stringify(getOptionsRequest));
            this.warningRepository.getOptions(getOptionsRequest)
                .done(function (getOptionsResponse) {
                    var purposes;
                    var durations;
                    var areas;
                    if (getOptionsResponse) {
                        purposes = getOptionsResponse.purposes;
                        durations = getOptionsResponse.durations;
                        areas = getOptionsResponse.areas;
                    }
                    deferred.resolve(purposes, durations, areas);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        getSettings: function () {
            var getSettingsRequest = {};
            var deferred = $.Deferred();
            console.trace('PersistenceContext.getSettings - ' + JSON.stringify(getSettingsRequest));
            this.settingsRepository.getSettings(getSettingsRequest)
                .done(function (getSettingsResponse) {
                    var helpEmail;
                    var updateStationEmail;
                    if (getSettingsResponse) {
                        helpEmail = getSettingsResponse.helpEmail;
                        updateStationEmail = getSettingsResponse.updateStationEmail;
                    }
                    deferred.resolve(helpEmail, updateStationEmail);
                })
                .fail(function (error) {
                    console.error(JSON.stringify(error));
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        checkIn: function (checkInRequest) {
            var deferred = $.Deferred();
            console.trace('PersistenceContext.checkIn - ' + JSON.stringify(checkInRequest));

            this.stationEntryLogRepository.checkIn(checkInRequest)
                .done(function (checkInResponse) {
                    var results;
                    if (checkInResponse) {
                        results = checkInResponse.stationEntryLog;
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
            var deferred = $.Deferred();
            console.trace('PersistenceContext.editCheckIn - ' + JSON.stringify(editCheckInRequest));
            this.stationEntryLogRepository.editCheckIn(editCheckInRequest)
                .done(function (editCheckInResponse) {
                    var results;
                    if (editCheckInResponse) {
                        results = editCheckInResponse.stationEntryLog;
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
            var deferred = $.Deferred();
            console.trace('PersistenceContext.checkOut - ' + JSON.stringify(checkOutRequest));
            this.stationEntryLogRepository.checkOut(checkOutRequest)
                .done(function (checkOutResponse) {
                    var results;
                    if (checkOutResponse) {
                        results = checkOutResponse.stationEntryLog;
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

    return PersistenceContext;
});