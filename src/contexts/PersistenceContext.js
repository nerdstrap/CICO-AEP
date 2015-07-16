define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    /**
     *
     * @param options
     * @constructor
     */
    var PersistenceContext = function(options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(PersistenceContext.prototype, {
        /**
         *
         * @param options
         */
        initialize: function(options) {
            console.trace('PersistenceContext.initialize');
            options || (options = {});
            this.geoLocationService = options.geoLocationService;
            this.repository = options.repository;
            this.mapper = options.mapper;
        },
        /**
         *
         * @param myPersonnelModel
         * @param openStationEntryLogModel
         * @returns {promise}
         */
        getMyPersonnelAndOpenStationEntryLogs: function(myPersonnelModel, openStationEntryLogModel) {
            console.trace('PersistenceContext.getMyPersonnelAndOpenStationEntryLogs');
            var currentContext = this;
            var deferred = $.Deferred();

            var getOpenStationEntryLogsRequest = {
                open: true
            };
            $.when(currentContext.repository.getMyPersonnel(), currentContext.repository.getOpenStationEntryLogs(getOpenStationEntryLogsRequest))
                    .done(function(getMyPersonnelResponse, getOpenStationEntryLogsResponse) {
                        currentContext.mapper.mapGetMyPersonnelResponse(getMyPersonnelResponse, myPersonnelModel);
                        currentContext.mapper.mapGetOpenStationEntryLogsResponse(getOpenStationEntryLogsResponse, openStationEntryLogModel);
                        deferred.resolve(myPersonnelModel, openStationEntryLogModel);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param stationModel
         * @returns {promise}
         */
        getStationById: function(stationModel) {
            console.trace('PersistenceContext.getStationById');
            var currentContext = this;
            var deferred = $.Deferred();

            var getStationByIdRequest = _.extend({}, stationModel.attributes);
            $.when(currentContext.repository.getStation(getStationByIdRequest))
                    .done(function(getStationByIdResponse) {
                        currentContext.mapper.mapGetStationByIdResponse(getStationByIdResponse, stationModel);
                        deferred.resolve(stationModel);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param personnelModel
         * @returns {promise}
         */
        getPersonnelById: function(personnelModel) {
            console.trace('PersistenceContext.getPersonnelById');
            var currentContext = this;
            var deferred = $.Deferred();

            var getPersonnelByIdRequest = _.extend({}, personnelModel.attributes);
            $.when(currentContext.repository.getStation(getPersonnelByIdRequest))
                    .done(function(getPersonnelByIdResponse) {
                        currentContext.mapper.mapGetPersonnelByIdResponse(getPersonnelByIdResponse, personnelModel);
                        deferred.resolve(personnelModel);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param personnelModel
         * @returns {promise}
         */
        getPersonnelByName: function(personnelModel) {
            console.trace('PersistenceContext.getPersonnelByName');
            var currentContext = this;
            var deferred = $.Deferred();

            var getPersonnelByNameRequest = _.extend({}, personnelModel.attributes);
            $.when(currentContext.repository.getStation(getPersonnelByNameRequest))
                    .done(function(getPersonnelByNameResponse) {
                        currentContext.mapper.mapGetPersonnelByIdResponse(getPersonnelByNameResponse, personnelModel);
                        deferred.resolve(personnelModel);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param stationEntryLogModel
         * @returns {promise}
         */
        getStationEntryLogById: function(stationEntryLogModel) {
            console.trace('PersistenceContext.getStationEntryLogById');
            var currentContext = this;
            var deferred = $.Deferred();

            var getStationEntryLogByIdRequest = _.extend({}, stationEntryLogModel.attributes);
            $.when(currentContext.repository.getStation(getStationEntryLogByIdRequest))
                    .done(function(getStationEntryLogByIdResponse) {
                        currentContext.mapper.mapGetStationEntryLogByIdResponse(getStationEntryLogByIdResponse, stationEntryLogModel);
                        deferred.resolve(stationEntryLogModel);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param purposeCollection
         * @param durationCollection
         * @param areaCollection
         * @returns {promise}
         */
        getOptions: function(purposeCollection, durationCollection, areaCollection) {
            console.trace('PersistenceContext.getOptions');
            var currentContext = this;
            var deferred = $.Deferred();

            $.when(currentContext.repository.getOptions())
                    .done(function(getOptionsResponse) {
                        if (purposeCollection) {
                            purposeCollection.reset(getOptionsResponse.purposes);
                        }
                        if (durationCollection) {
                            durationCollection.reset(getOptionsResponse.durations);
                        }
                        if (areaCollection) {
                            durationCollection.reset(getOptionsResponse.areas);
                        }
                        deferred.resolve(purposeCollection, durationCollection, areaCollection);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param stationCollection
         * @param options
         * @returns {promise}
         */
        refreshStationCollectionByGps: function(stationCollection, options) {
            console.trace('PersistenceContext.refreshStationCollectionByGps');
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            currentContext.geoLocationService.getCurrentPosition()
                    .done(function(position) {
                        var getNearbyStationsRequest = _.extend({}, options, {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                        currentContext.repository.getNearbyStations(getNearbyStationsRequest)
                                .done(function(getNearbyStationsResponse) {
                                    stationCollection.reset(getNearbyStationsResponse.stations);
                                    deferred.resolve(stationCollection);
                                })
                                .fail(function(getNearbyStationsError) {
                                    stationCollection.reset();
                                    deferred.reject(getNearbyStationsError);
                                });
                    })
                    .fail(function(getCurrentPositionError) {
                        deferred.reject(getCurrentPositionError);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param stationCollection
         * @param options
         * @returns {promise}
         */
        refreshStationCollection: function(stationCollection, options) {
            console.trace('PersistenceContext.refreshStationCollection');
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var getStationsRequest = _.extend({}, options);
            currentContext.repository.getStations(getStationsRequest)
                    .done(function(getStationsResponse) {
                        stationCollection.reset(getStationsResponse.stations);
                        deferred.resolve(stationCollection);
                    })
                    .fail(function(error) {
                        stationCollection.reset();
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param personnelCollection
         * @param options
         * @returns {promise}
         */
        refreshPersonnelCollection: function(personnelCollection, options) {
            console.trace('PersistenceContext.refreshPersonnelCollection');
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var getPersonnelsRequest = _.extend({}, options);
            currentContext.repository.getStations(getPersonnelsRequest)
                    .done(function(getPersonnelsResponse) {
                        personnelCollection.reset(getPersonnelsResponse.personnels);
                        deferred.resolve(personnelCollection);
                    })
                    .fail(function(error) {
                        personnelCollection.reset();
                        deferred.reject(error);
                    });
                    

            return deferred.promise();
        },
        /**
         *
         * @param entryLogCollection
         * @param options
         * @returns {promise}
         */
        refreshStationEntryLogCollectionByGps: function(entryLogCollection, options) {
            console.trace('PersistenceContext.refreshStationEntryLogCollection');
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            currentContext.geoLocationService.getCurrentPosition()
                    .done(function(position) {
                        var getNearbyStationEntryLogsRequest = _.extend({}, options, {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                        currentContext.repository.getNearbyStationEntryLogs(getNearbyStationEntryLogsRequest)
                                .done(function(getNearbyStationEntryLogsResponse) {
                                    entryLogCollection.reset(getNearbyStationEntryLogsResponse.stationEntryLogs);
                                    deferred.resolve(entryLogCollection);
                                })
                                .fail(function(getNearbyStationEntryLogsError) {
                                    entryLogCollection.reset();
                                    deferred.reject(getNearbyStationEntryLogsError);
                                });
                    })
                    .fail(function(getCurrentPositionError) {
                        deferred.reject(getCurrentPositionError);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param entryLogCollection
         * @param options
         * @returns {promise}
         */
        refreshStationEntryLogCollection: function(entryLogCollection, options) {
            console.trace('PersistenceContext.refreshStationEntryLogCollection');
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var getStationEntryLogsRequest = _.extend({}, options);
            currentContext.repository.getStationEntryLogs(getStationEntryLogsRequest)
                    .done(function(getStationEntryLogsResponse) {
                        entryLogCollection.reset(getStationEntryLogsResponse.stationEntryLogs);
                        deferred.resolve(entryLogCollection);
                    })
                    .fail(function(error) {
                        entryLogCollection.reset();
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param warningCollection
         * @param options
         * @returns {promise}
         */
        refreshWarningCollection: function(warningCollection, options) {
            console.trace('PersistenceContext.refreshWarningCollection');
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var getWarningsRequest = _.extend({}, options);
            currentContext.repository.getWarnings(getWarningsRequest)
                    .done(function(getWarningsResponse) {
                        warningCollection.reset(getWarningsResponse.warnings);
                        deferred.resolve(warningCollection);
                    })
                    .fail(function(error) {
                        warningCollection.trigger('error');
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param abnormalConditionCollection
         * @param options
         * @returns {promise}
         */
        refreshAbnormalConditionCollection: function(abnormalConditionCollection, options) {
            console.trace('PersistenceContext.refreshAbnormalConditionCollection');
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var getAbnormalConditionsRequest = _.extend({}, options);
            currentContext.repository.getAbnormalConditions(getAbnormalConditionsRequest)
                    .done(function(getAbnormalConditionsResponse) {
                        abnormalConditionCollection.reset(getAbnormalConditionsResponse.abnormalConditions);
                        deferred.resolve(abnormalConditionCollection);
                    })
                    .fail(function(error) {
                        abnormalConditionCollection.trigger('error');
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param stationEntryLogModel
         * @returns {promise}
         */
        checkIn: function(stationEntryLogModel) {
            console.trace('PersistenceContext.checkIn');
            var currentContext = this;
            var deferred = $.Deferred();

            var checkInRequest = _.extend({}, stationEntryLogModel.attributes);
            currentContext.repository.postCheckIn(checkInRequest)
                    .done(function(checkInResponse) {
                        stationEntryLogModel.set(checkInResponse.entryLog);
                        deferred.resolve(stationEntryLogModel);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param stationEntryLogModel
         * @returns {promise}
         */
        editCheckIn: function(stationEntryLogModel) {
            console.trace('PersistenceContext.editCheckIn');
            var currentContext = this,
                    deferred = $.Deferred();

            var editCheckInRequest = _.extend({}, stationEntryLogModel.attributes);
            currentContext.repository.postEditCheckIn(editCheckInRequest)
                    .done(function(editCheckInResponse) {
                        stationEntryLogModel.set(editCheckInResponse.entryLog);
                        deferred.resolve(stationEntryLogModel);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        },
        /**
         *
         * @param stationEntryLogModel
         * @returns {promise}
         */
        checkOut: function(stationEntryLogModel) {
            console.trace('PersistenceContext.checkOut');
            var currentContext = this,
                    deferred = $.Deferred();

            var checkOutRequest = _.extend({}, stationEntryLogModel.attributes);
            currentContext.repository.postCheckOut(checkOutRequest)
                    .done(function(checkOutResponse) {
                        stationEntryLogModel.set(checkOutResponse.entryLog);
                        deferred.resolve(stationEntryLogModel);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });

            return deferred.promise();
        }

    });

    return PersistenceContext;
});